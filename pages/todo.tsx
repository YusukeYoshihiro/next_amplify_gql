import * as React from "react";
// import { NextComponentType, NextPageContext } from 'next';
import { useState } from 'react';
import Amplify from '@aws-amplify/core';
import PubSub from '@aws-amplify/pubsub';
import API, { graphqlOperation } from '@aws-amplify/api';
// import nanoid from 'nanoid'
// import produce from 'immer'

import awsmobile from '../src/aws-exports';
import {
  createTodo,
  deleteTodo,
  updateTodo
} from '../src/graphql/mutations';
import { getTodo, listTodos } from '../src/graphql/queries';
import { onCreateTodo, onUpdateTodo, onDeleteTodo } from '../src/graphql/subscriptions';

import Head from '../components/templates/head'
import Navigation from '../components/templates/navigation'

Amplify.configure(awsmobile);
API.configure(awsmobile);
PubSub.configure(awsmobile);


interface TodoType {
  id: number,
  description: string
  isDone: boolean
}

interface DataProp {
  data: {
    listTodos?: {
      items: Array<TodoType>
    }
  }
}

const Todo = (props: DataProp) => {
  const { items: todoItems } = props.data.listTodos;

  const [todo, setTodo] = useState('');
  const [list, setList] = useState([]);

  // 新規追加でTodoを追加する
  const submitTodo = async (list: Array<string>, todo: string) => {
    const id = Math.floor(Math.random() * Math.floor(1000))
    const inputData = {
      input: {
        id,
        description: todo,
        isDone: false
      }
    }
    try {
      await API.graphql(graphqlOperation(createTodo, inputData));
    } catch (e) {
      console.log(e);
    }
  };

  // 既存のTodoを削除する
  const deleteItem = async (id) => {

    const deleteData = {
      input: {
        id
      }
    }

    try {
      await API.graphql(graphqlOperation(deleteTodo, deleteData));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Head title="todo" />
      <Navigation />
      <h2>Todo with amplify</h2>
      <input style={{
        border: 'solid 1px #ddd',
        padding: 10,
        borderRadius: 4,
        fontSize: 18,
        WebkitAppearance: 'none',
        color: '#333'
      }} value={todo} type="text" placeholder="please write todo" onChange={e => setTodo(e.target.value)} />
      <button style={{
        padding: 10,
        background: '#F06292',
        color: '#eee',
        borderRadius: 4,
        fontSize: 18,
        WebkitAppearance: 'none'
      }} onClick={() => submitTodo(list, todo)}>add Todo</button>
      <ul className="ListContainer">{
        todoItems.map( item => (
          <li key={item.id} className="ListItem">
            <span className="title">{item.description}</span>
            <span>{item.isDone}</span>
            <input type="button" value="delete" onClick={() => deleteItem(item.id)} />
          </li>
        ))
      }</ul>
    </div>
  )
};

Todo.getInitialProps = async (props) => {

  const data = await API.graphql(graphqlOperation(listTodos));

  // try {
  //   // API.graphql(graphqlOperation(onCreateTodo)).subscribe({
  //   //   next: (eventData) => { console.log(eventData) }
  //   // });
  //   const client = API.graphql(graphqlOperation(onCreateTodo));
  // } catch (e) {
  //   console.log(e);
  // }

  // if ("subscribe" in client) {
  //   client.subscribe({
  //     next: (e) => {
  //       console.log(e);
  //     }
  //   });
  // } else {
  //   console.log("subscribe");
  // }

  return {...props, ...data};
};

export default Todo;
