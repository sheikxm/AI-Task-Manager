from bson import ObjectId
from app.models import Task , TaskInDB
from typing import List
from app.database import tasks_collection

def create_task(task : Task) -> TaskInDB:
    task_dict = task.dict()
    result = tasks_collection.insert_one(task_dict)
    task_dict["_id"] = str(result.inserted_id)
    return TaskInDB(**task_dict)

def get_tasks() ->List[TaskInDB]:
    tasks = tasks_collection.find()
    return[TaskInDB(**task) for task in tasks]

def get_task(task_id : str) -> TaskInDB:
    task = tasks_collection.find_one({"_id" : objectId(task_id)})
    if task:
        return TaskInDB(**task)
    return None
def update_task(task_id : str , task :Task ) -> TaskInDB:
    updated_task = tasks_collection.find_one_and_update(
        {"_id" : objectId(task_id)},
        {"$set" : task.dist()},
        return_document = True
    )
    if updated_task:
        return TaskInDB(**updated_task)
    return None

def delete_task( task_id :str ) ->bool:
    result = tasks_collection.delete_one({"_id_": objectId(task_id)})
    return result.deleted_count >0
