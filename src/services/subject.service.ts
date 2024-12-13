// src/services/subject.service.ts
import { NotFoundError } from "elysia";
import { CreateSubject, Subject, UpdateSubject } from "../models/subject.model";
import { PrismaType, Prisma } from "../utils/prisma";

export class SubjectService {
  constructor(private readonly prisma: PrismaType) {}

  async findAll(): Promise<Subject[]> {
    return await this.prisma.subject.findMany();
  }

  async findById(id: string): Promise<Subject> {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundError(`Subject with id ${id} not found`);
    }

    return subject;
  }

  async create(data: CreateSubject): Promise<Subject> {
    return await this.prisma.subject.create({ data });
  }

  async update(id: string, data: UpdateSubject): Promise<Subject> {
    try {
      return await this.prisma.subject.update({
        where: { id },
        data,
      });
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
        throw new NotFoundError(`Subject with id ${id} not found`);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.subject.delete({
        where: { id },
      });
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
        throw new NotFoundError(`Subject with id ${id} not found`);
      }
      throw error;
    }
  }
}
