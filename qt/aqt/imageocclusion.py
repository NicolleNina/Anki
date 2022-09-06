# Copyright: Ankitects Pty Ltd and contributors
# License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

from __future__ import annotations

import aqt
import aqt.deckconf
import aqt.main
import aqt.operations
from aqt.qt import *
from aqt.utils import addCloseShortcut, disable_help_button, restoreGeom, saveGeom, tr
from aqt.webview import AnkiWebView


class ImageOcclusionDialog(QDialog):

    TITLE = "image occlusion"
    silentlyClose = True

    def __init__(
        self,
        mw: aqt.main.AnkiQt,
        path: str,
    ) -> None:
        QDialog.__init__(self, mw)
        self.mw = mw
        self._setup_ui(path)
        self.show()

    def _setup_ui(self, path: str) -> None:
        self.setWindowModality(Qt.WindowModality.ApplicationModal)
        self.mw.garbage_collect_on_dialog_finish(self)
        self.setMinimumSize(400, 300)
        disable_help_button(self)
        restoreGeom(self, self.TITLE)
        addCloseShortcut(self)

        self.web = AnkiWebView(title=self.TITLE)
        self.web.setVisible(False)
        self.web.load_ts_page("image-occlusion")
        layout = QVBoxLayout()
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(self.web)
        self.setLayout(layout)

        self.web.eval(f"anki.setupImageOcclusion('{path}');")
        self.setWindowTitle(self.TITLE)

    def reject(self) -> None:
        self.web.cleanup()
        self.web = None
        saveGeom(self, self.TITLE)
        QDialog.reject(self)
