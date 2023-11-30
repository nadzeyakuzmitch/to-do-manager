'use client';

import { FormEvent, useEffect, useState } from "react";


/** Items list class */
interface ItemsList {
  items: ToDoItem[];
}

/** Item class */
interface ToDoItem {
  title: string;
  due: string;
  content: string;
  status: number;
  id: string;
}

function createUniqueId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function (c) {
      var uuid = Math.random() * 16 | 0, v = c == 'x' ? uuid : (uuid & 0x3 | 0x8);
      return uuid.toString(16);
    });
}

export default function Home() {

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [toDosList, setToDosList] = useState([] as ToDoItem[]);

  useEffect(() => {
    const userNotes = localStorage.getItem('userNotes');
    if (!userNotes) {
      const newNotesArray = { items: [] } as ItemsList;
      localStorage.setItem('userNotes', JSON.stringify(newNotesArray));
      setToDosList([]);
    } else {
      setToDosList(JSON.parse(localStorage.getItem('userNotes') as string).items);
    }
  }, []);

  function onCleanClick() {
    const newNotesArray = { items: [] };
    localStorage.setItem('userNotes', JSON.stringify(newNotesArray));
    setToDosList([]);
  }

  function onAddNew() {
    setToDosList(JSON.parse(localStorage.getItem('userNotes') as string).items);
  }

  function onCreateNew(status: boolean) {
    setIsCreatingNew(status);
  }

  function onUpdateItem(toDoItem: ToDoItem) {
    const newNotesArray = { items: JSON.parse(localStorage.getItem('userNotes') as string).items };
    newNotesArray.items[newNotesArray.items.findIndex((item: ToDoItem) => item.id === toDoItem.id)] = { ...toDoItem };
    localStorage.setItem('userNotes', JSON.stringify(newNotesArray));
    setToDosList(newNotesArray.items);
  }

  function onDeleteItem(id: string) {
    const newNotesArray = { items: JSON.parse(localStorage.getItem('userNotes') as string).items };
    newNotesArray.items.splice(newNotesArray.items.findIndex((item: ToDoItem) => item.id === id), 1)
    localStorage.setItem('userNotes', JSON.stringify(newNotesArray));
    setToDosList(newNotesArray.items);
  }

  return (
    <>
      <div className="p-3 m-auto" style={{ maxWidth: '400px' }}>

        <span className="display-5 d-flex w-100 align-items-center justify-content-center py-2 pb-3">To-Do Manager</span>

        <button type="button" className="btn btn-outline-secondary mb-3 w-100" onClick={onCleanClick}>Clear All To-Dos <i className="fa-solid fa-spray-can-sparkles"></i></button>
        <button type="button" className="btn btn-outline-primary mb-3 w-100 d-flex flex-column align-items-center justify-content-center" onClick={() => onCreateNew(true)}>I Need To-Do... <i className="fa-solid fa-file-circle-plus"></i></button>

        {isCreatingNew ? <NewCard onAddNew={onAddNew} onCancel={() => onCreateNew(false)} className="mb-3" /> : ''}

        {toDosList.map((toDoItem: ToDoItem, index: number) => (<>
          <Card onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} key={`${index}-item`} item={toDoItem} className="mb-3" />
        </>))}

      </div >
    </>
  )
}


function NewCard({ onAddNew, onCancel, className }: { onAddNew: () => void, onCancel: () => void, className?: string }) {

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = [...formData as any];

    const newToDo: ToDoItem = {
      title: params[0][1],
      due: params[1][1],
      content: params[2][1],
      status: 0,
      id: createUniqueId()
    }

    const userNotes = JSON.parse(localStorage.getItem('userNotes') as string);
    userNotes.items.unshift(newToDo);
    localStorage.setItem('userNotes', JSON.stringify(userNotes));

    (event.target as HTMLFormElement).reset();

    onAddNew();
  }

  return (
    <>
      <div className={`${className} border border-primary rounded p-3`}>
        <form onSubmit={onSubmit}>
          <div className="card-body form-group">

            <div className="mb-3">
              <input type="text" className="form-control" name="title" placeholder="Let's title it" required />
            </div>

            <div className="mb-3">
              <input className="form-control" type="date" name="due" required />
            </div>

            <div className="mb-3">
              <textarea className="form-control" name="content" rows={3} placeholder="What's on your mind?" required></textarea>
            </div>

            <div className="d-flex justify-content-stretch mt-2">
              <button type="button" className="btn btn-outline-danger w-100 me-2" onClick={onCancel}>Cancel <i className="fa-solid fa-ban"></i></button>
              <button type="submit" className="btn btn-outline-info w-100">Save <i className="fa-solid fa-floppy-disk"></i></button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}


function Card({ onUpdateItem, onDeleteItem, item, className }: { onUpdateItem: (toDoItem: ToDoItem) => void, onDeleteItem: (id: string) => void, item: ToDoItem, className?: string }) {

  function isOverdue(): boolean {
    return new Date(item.due).getTime() < new Date().getTime() && item.status !== 2;
  }

  function getStatusColor(): string {
    if (isOverdue()) {
      return 'border-danger';
    }
    switch (item.status) {
      case 0: {
        return 'border-info';
      }
      case 1: {
        return 'border-warning';
      }
      case 2: {
        return 'border-success';
      }
    }
    return '';
  }

  function updateStatus(status: number): void {
    item.status = status;
    onUpdateItem({ ...item, status })
  }

  function deleteToDo(): void {
    onDeleteItem(item.id);
  }

  return (
    <>
      <div className={`${className} border ${getStatusColor()} rounded p-3`}>
        <div className="card-body">
          <div className="d-flex">
            <h5 className="card-title m-0">{item.title}</h5>
            {item.status === 0 ? <span className="rounded bg-info text-white px-1 ms-2"><small>New</small></span> : ''}
            {isOverdue() && item.status !== 2 ? <span className="rounded bg-danger text-white px-1 ms-2"><small>Overdue</small></span> : ''}
          </div>

          <div className="d-flex">
            <span className="text-secondary"><small>Due Date: {item.due}</small></span>
          </div>
          <p className="card-text mt-2">{item.content}</p>

          <div className="d-flex">
            <button type="button" className="btn btn-outline-danger w-100" onClick={deleteToDo}>Delete <i className="fa-solid fa-trash-alt"></i></button>
          </div>

          <div className="d-flex justify-content-stretch mt-2">
            <button type="button" className={`btn ${item.status === 1 ? 'btn-warning' : 'btn-outline-warning'} w-100 me-2`} onClick={() => updateStatus(1)}>In Progress <i className="fa-solid fa-spinner"></i></button>
            <button type="button" className={`btn ${item.status === 2 ? 'btn-success' : 'btn-outline-success'} w-100`} onClick={() => updateStatus(2)}>Complete <i className="fa-solid fa-circle-check"></i></button>
          </div>
        </div>
      </div>
    </>
  )
}