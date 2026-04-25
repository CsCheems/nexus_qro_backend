const tasksService = require("../services/tasks.service");
const ventureService  = require("../services/venture.service");

async function createEvidence(req, res) {
  try {
    const result = await tasksService.createEvidence(req.body, req.userProfile);

    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Error al crear evidencia",
    });
  }
}



async function getEvidencesByTask(req, res) {
  try {
    const { ventureId, taskKey } = req.params;

    const result = await tasksService.getEvidencesByTask(ventureId, taskKey, req.userProfile);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Error al obtener evidencias",
    });
  }
}

async function uploadEvidenceFile(req, res) {
  try {
    const result = await tasksService.uploadEvidenceFile({
      body: req.body,
      file: req.file,
      userProfile: req.userProfile,
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Error al subir archivo",
    });
  }
}

async function completeTask(req, res){
  try{
    const { id: taskId } = req.params;
    const { ventureId } = req.body;  
    
    if (!ventureId) {
      throw new Error("ventureId es requerido");
    }

    await tasksService.completeTask(taskId, ventureId);
    
    const task = tasksService.getTask(taskId);

    const tasks = await tasksService.getTasksByStage(
      task.stage,
      ventureId
    );

    const allCompleted = tasks.filter(t => t.required).every(t => t.status === "completa");

    if (allCompleted) {
      const currentStage = await ventureService.getVentureStage(req.user, req.userProfile, ventureId);
      await ventureService.advanceVentureStage(ventureId, currentStage.stage);
    }

    return res.status(200).json({
      message: "Tarea completada correctamente",
    });

  }catch(error){
     return res.status(error.status || 500).json({
      message: error.message || "Error al completar tarea",
    });
  }
}



module.exports = {
  createEvidence,
  getEvidencesByTask,
  uploadEvidenceFile,
  completeTask
};