from dataclasses import dataclass

@dataclass(frozen=True)
class Position:

    file_id: int
    sentence_key: int
    position: int