// src/services/subject.service.interface.ts
import { CreateSubject, Subject, UpdateSubject } from "../models/subject.model";

export interface ISubjectService {
  findAll(): Promise<Subject[]>;
  findById(id: string): Promise<Subject>;
  create(command: CreateSubject): Promise<Subject>;
  update(id: string, command: UpdateSubject): Promise<Subject>;
  delete(id: string): Promise<void>;
}
