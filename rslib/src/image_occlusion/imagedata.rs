// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

use std::{fs::read, path::Path};

use crate::notetype::{Notetype, NotetypeConfig};
pub use crate::pb::image_occlusion::{ImageClozeMetadata, ResultAddNotes};
use crate::{media::MediaManager, prelude::*};
use serde_json::Value;

pub(crate) const DEFAULT_IO_FRONT_TEMPLATE: &str = include_str!("io_front_template.html");
pub(crate) const DEFAULT_IO_BACK_TEMPLATE: &str = include_str!("io_back_template.html");

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
    ) -> Result<ResultAddNotes> {
        let mut resul_add_notes = ResultAddNotes {
            ..Default::default()
        };

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

        // add or update image cloze note type
        let note_type_name = "Image Cloze - Anki Ecosystem";
        self.add_or_update_io_cloze_note_type(&note_type_name.to_string())?;

        let io_notes = self.get_io_notes(notes_data);

        let nt = self
            .get_notetype_by_name(&note_type_name)?
            .ok_or(AnkiError::NotFound)?;

        let mut note = nt.new_note();
        note.set_field(0, io_notes[0].clone())?;
        note.set_field(1, &image_tag)?;
        note.set_field(2, io_notes[1].clone())?;

        // the routine should return these changes
        self.add_note(&mut note, DeckId(1))?;

        resul_add_notes.is_added = true;
        Ok(resul_add_notes)
    }

    pub fn get_data_using_key(&mut self, json: &Value, key: &str) -> String {
        let data = json.get(key);
        if data != None {
            data.unwrap().as_str().unwrap().to_string()
        } else {
            "".to_string()
        }
    }

    pub fn get_io_notes(&mut self, notes_data: &[u8]) -> Vec<String> {
        let notes_fields_data = std::str::from_utf8(&notes_data).unwrap();
        let notes: Value = serde_json::from_str(&notes_fields_data).unwrap();

        let io_notes = vec![
            self.get_data_using_key(&notes, "occlusions"),
            self.get_data_using_key(&notes, "notes"),
            self.get_data_using_key(&notes, "tags"),
        ];

        return io_notes;
    }

    pub fn add_or_update_io_cloze_note_type(&mut self, note_type_name: &String) -> Result<()> {
        let nt = &mut Notetype {
            id: NotetypeId(9358342513643),
            name: note_type_name.into(),
            config: NotetypeConfig::new_cloze(),
            ..Default::default()
        };

        let occlusions = "Occlusions";
        nt.add_field(occlusions);
        let image = "Image";
        nt.add_field(image);
        let notes = "Notes";
        nt.add_field(notes);
        let qfmt = DEFAULT_IO_FRONT_TEMPLATE;
        let afmt = DEFAULT_IO_BACK_TEMPLATE;
        nt.add_template(nt.name.clone(), qfmt, afmt);

        return self.add_or_update_notetype_with_existing_id(nt, false);
    }
}
