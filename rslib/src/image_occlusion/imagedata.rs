// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

use std::{fs::read, path::Path, sync::Arc};

use crate::notetype::{CardGenContext, Notetype, NotetypeConfig};
pub use crate::pb::image_occlusion::ImageClozeMetadata;
use crate::{media::MediaManager, prelude::*};
use serde_json::Value;

impl Collection {
    pub fn get_image_cloze_metadata(&mut self, path: &str) -> Result<ImageClozeMetadata> {
        let mut metadata = ImageClozeMetadata {
            ..Default::default()
        };

        metadata.data = read(path)?;
        metadata.deck_id = 1;
        // metadata.notetype = self.notetype_id()

        Ok(metadata)
    }

    pub fn add_image_occlusion_notes(
        &mut self,
        image_path: &str,
        notes_data: &[u8],
        target_deck: DeckId,
    ) -> Result<OpOutput<()>> {
        // image file
        let image_bytes = read(image_path)?;
        let image_filename = Path::new(&image_path)
            .file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .to_string();

        let mgr = MediaManager::new(&self.media_folder, &self.media_db)?;
        let mut ctx = mgr.dbctx();
        let actual_image_name_after_adding =
            mgr.add_file(&mut ctx, &image_filename, &image_bytes)?;

        let image_tag = format!(
            "<img id='img' src='{}'></img>",
            &actual_image_name_after_adding
        );

        self.transact(Op::ImageOcclusion, |col| {
            let nt = col.get_or_create_io_notetype()?;
            let io_notes = col.get_io_notes(notes_data);

            let mut note = nt.new_note();
            note.set_field(0, io_notes[0].clone())?;
            note.set_field(1, &image_tag)?;
            note.set_field(2, io_notes[1].clone())?;

            let last_deck = col.get_last_deck_added_to_for_notetype(note.notetype_id);
            let ctx = CardGenContext::new(nt.as_ref(), last_deck, col.usn()?);
            let norm = col.get_config_bool(BoolKey::NormalizeNoteText);
            col.add_note_inner(&ctx, &mut note, target_deck, norm)?;

            Ok(())
        })
    }

    fn get_or_create_io_notetype(&mut self) -> Result<Arc<Notetype>> {
        // todo: i18n
        let name = "Image Occlusion";
        let nt = match self.get_notetype_by_name(&name)? {
            Some(nt) => nt,
            None => {
                self.add_io_notetype(name)?;
                self.get_notetype_by_name(&name)?
                    .ok_or(AnkiError::NotFound)?
            }
        };
        if nt.fields.len() < 3 {
            Err(AnkiError::invalid_input("IO notetype must have 3+ fields"))
        } else {
            Ok(nt)
        }
    }

    fn get_data_using_key(&mut self, json: &Value, key: &str) -> String {
        let data = json.get(key);
        if data != None {
            data.unwrap().as_str().unwrap().to_string()
        } else {
            "".to_string()
        }
    }

    fn get_io_notes(&mut self, notes_data: &[u8]) -> Vec<String> {
        let notes_fields_data = std::str::from_utf8(&notes_data).unwrap();
        let notes: Value = serde_json::from_str(&notes_fields_data).unwrap();

        let io_notes = vec![
            self.get_data_using_key(&notes, "occlusions"),
            self.get_data_using_key(&notes, "notes"),
            self.get_data_using_key(&notes, "tags"),
        ];

        return io_notes;
    }

    fn add_io_notetype(&mut self, name: &str) -> Result<()> {
        let usn = self.usn()?;
        let mut notetype = Notetype {
            name: name.into(),
            config: NotetypeConfig::new_cloze(),
            ..Default::default()
        };
        notetype.set_modified(usn);
        // TODO: i18n
        notetype.add_field("Occlusions");
        notetype.add_field("Image");
        notetype.add_field("Notes");
        notetype.add_template(
            notetype.name.clone(),
            include_str!("io_front_template.html"),
            include_str!("io_back_template.html"),
        );
        self.add_notetype_inner(&mut notetype, usn, false)?;
        Ok(())
    }
}
