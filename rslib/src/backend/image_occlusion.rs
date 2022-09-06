// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

use super::Backend;
pub(super) use crate::pb::imageocclusion_service::Service as ImageOcclusionService;
use crate::{
    pb::{self as pb},
    prelude::*,
};

impl ImageOcclusionService for Backend {
    fn get_image_cloze_metadata(&self, input: pb::ImageClozeMetadataRequest) -> Result<pb::ImageClozeMetadata> {
        self.with_col(|col| col.get_image_cloze_metadata(&input.path))
    }

    fn add_image_occlusion_notes(&self, input: pb::AddImageOcclusionNotesRequest) -> Result<pb::ResultAddNotes> {
        self.with_col(|col| col.add_image_occlusion_notes(&input.image_path, &input.notes_data))
    }
}
