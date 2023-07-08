import {TodoItem} from "../models/TodoItem";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import {TodoUpdate} from "../models/TodoUpdate";
import {ToDoAccess} from "../dataLayer/toDoAccess";
import { createLogger } from '../utils/logger';

const logger = createLogger('Log from Todos.ts')
const uuidv4 = require('uuid/v4');
const toDoAccess = new ToDoAccess();
const s3BucketName = process.env.S3_BUCKET_NAME;

export async function getAllToDo(userId: string): Promise<TodoItem[]> {
    logger.info(`Getting all todos for user: ${userId}`)
    return toDoAccess.getAllToDo(userId);
}

export function createToDo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    logger.info(`Creating new todo for user: ${userId}`)
    const todoId =  uuidv4();
    
    const newTodo: TodoItem = {
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.us-east-1.amazonaws.com/${todoId}`,
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    }
    
    return toDoAccess.createToDo(newTodo);
}

export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoUpdate> {
    logger.info(`Updating todo: ${todoId} of user: ${userId}`)

    return toDoAccess.updateToDo(updateTodoRequest, todoId, userId);
}

export async function deleteToDo(todoId: string, userId: string): Promise<string> {
    logger.info(`Deleting todo: ${todoId} of user: ${userId}`)
    const item = await toDoAccess.getTodoItemByKeySchema(todoId, userId);

    logger.info(`Checking auth of todo: ${todoId} for: user ${userId}`)
    if (!item) throw new Error(`Todo item of ${todoId} is not exist !`) 
    logger.info(`Check auth of todo: ${todoId} for: user ${userId} : SUCCESS !`)

    return toDoAccess.deleteToDo(todoId, userId);
}

export async function removeImageInS3(id: string): Promise<void> {
    logger.info(`Removiong Image id: ${id} in S3 bucket: ${s3BucketName}`)

    return toDoAccess.removeImageInS3(id);
}

export function generateUploadUrl(todoId: string): Promise<string> {
    logger.info(`Generating uploadUrl of todoId: ${todoId}}`)

    return toDoAccess.generateUploadUrl(todoId);
}