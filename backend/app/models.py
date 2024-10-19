from pydantic import BaseModel , Field
from typing import Optional
from bson import ObjectId

class Task(BaseModel):
    title : str
    description : str 
    is_completed : bool = False
    
class TaskInDB(Task):
    id : Optional[str] = Field(defaut = None , alias = "_id")
    
class TaskInput(BaseModel):
    title: str
    description: str
    
    
class Config:
    json_encoders = {
        ObjectId: lambda oid: str(oid)
    }
