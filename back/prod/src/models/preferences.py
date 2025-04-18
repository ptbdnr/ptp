from __future__ import annotations

from typing import List  # noqa: UP035

from pydantic import BaseModel


# docscrigs are above the class definition
# becase the scema will use the docsring stored inside the class
"""Model for user dietary and budget preferences."""
class UserPreferences(BaseModel):

    preferences: List[str]  # noqa: UP006
