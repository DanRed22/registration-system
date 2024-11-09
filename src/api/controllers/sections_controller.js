import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getAllSections = async (req, res) => {
    try {
        const sections = await prisma.sections.findMany();
        res.json({
            error: false,
            message: 'Sections fetched successfully',
            data: sections,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: true,
            data: [],
            message: 'Internal Server Error',
        });
    }
};

const getSectionById = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            error: true,
            data: null,
            message: 'ID is required',
        });
    }
    try {
        const section = await prisma.sections.findUnique({
            where: { id: req.params.id },
        });
        res.json({
            error: false,
            message: 'Section fetched successfully',
            data: section,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: true,
            data: [],
            message: 'Internal Server Error',
        });
    }
};

const getSectionByName = async (req, res) => {
    if (!req.params.name) {
        return res.status(400).json({
            error: true,
            data: null,
            message: 'Name is required',
        });
    }
    try {
        const section = await prisma.sections.findFirst({
            where: { name: req.params.name },
        });
        res.json({
            error: false,
            message: 'Section fetched successfully',
            data: section,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: true,
            data: null,
            message: 'Internal Server Error',
        });
    }
};

const createSection = async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({
            error: true,
            data: null,
            message: 'Name is required',
        });
    }
    try {
        const section = await prisma.sections.create({
            data: { name: req.body.name },
        });
        res.json({
            error: false,
            message: 'Section created successfully',
            data: section,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: true,
            data: [],
            message: 'Internal Server Error',
        });
    }
};

const updateSection = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            error: true,
            data: null,
            message: 'ID is required',
        });
    }
    try {
        const section = await prisma.sections.update({
            where: { id: req.params.id },
            data: { name: req.body.name },
        });
        res.json({
            error: false,
            message: 'Section updated successfully',
            data: section,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: true,
            data: null,
            message: 'Internal Server Error',
        });
    }
};

const deleteSection = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            error: true,
            data: null,
            message: 'ID is required',
        });
    }
    try {
        const section = await prisma.sections.delete({
            where: { id: req.params.id },
        });
        res.json({
            error: false,
            message: 'Section deleted successfully',
            data: section,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: true,
            data: null,
            message: 'Internal Server Error',
        });
    }
};
module.exports = {
    getAllSections,
    getSectionById,
    getSectionByName,
    createSection,
    updateSection,
    deleteSection,
};
