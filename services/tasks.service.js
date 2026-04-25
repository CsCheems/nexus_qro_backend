const supabase = require('../config/supabase');
const path = require("path");
const { ROADMAP } = require("../constants/roadmap");

function sanitizeFileName(name) {
  return name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");
}

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function createEvidence(payload, userProfile) {
  try {
    const {
      venture_id,
      task_key,
      tipo,
      descripcion,
      url,
    } = payload;

    if (!venture_id || !task_key || !tipo) {
      const error = new Error("Faltan campos obligatorios");
      error.status = 400;
      throw error;
    }

    if (!["texto", "url"].includes(tipo)) {
      const error = new Error("Tipo de evidencia inválido");
      error.status = 400;
      throw error;
    }

    if (tipo === "texto" && !descripcion?.trim()) {
      const error = new Error("La descripción no puede estar vacía");
      error.status = 400;
      throw error;
    }

    if (tipo === "url") {
      if (!url) {
        const error = new Error("La URL es obligatoria");
        error.status = 400;
        throw error;
      }

      if (!validateUrl(url)) {
        const error = new Error("URL inválida");
        error.status = 400;
        throw error;
      }
    }

    const { data: venture, error: ventureError } = await supabase
      .from("ventures")
      .select("perfil_emprendedor_id")
      .eq("id", venture_id)
      .single();

    if (ventureError || !venture) {
      const error = new Error("Emprendimiento no encontrado");
      error.status = 404;
      throw error;
    }

    if (venture.perfil_emprendedor_id !== userProfile.id) {
      const error = new Error("No autorizado");
      error.status = 403;
      throw error;
    }

    // 💾 Insertar evidencia
    const { data, error: insertError } = await supabase
      .from("venture_task_evidences")
      .insert([
        {
          venture_id,
          task_key,
          perfil_emprendedor_id: userProfile.id,
          tipo,
          descripcion: descripcion || null,
          url: url || null,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    return data;

  } catch (error) {
    throw error;
  }
}

async function getEvidencesByTask(ventureId, taskKey, userProfile) {
  try {
    const { data: venture, error: ventureError } = await supabase
      .from("ventures")
      .select("perfil_emprendedor_id")
      .eq("id", ventureId)
      .single();

    if (ventureError || !venture) {
      const error = new Error("Emprendimiento no encontrado");
      error.status = 404;
      throw error;
    }

    if (
      userProfile.rol === "emprendedor" &&
      venture.perfil_emprendedor_id !== userProfile.id
    ) {
      const error = new Error("No autorizado");
      error.status = 403;
      throw error;
    }

    const { data, error } = await supabase
      .from("venture_task_evidences")
      .select("*")
      .eq("venture_id", ventureId)
      .eq("task_key", taskKey)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;

  } catch (error) {
    throw error;
  }
}

async function getEvidencesByVentureId(ventureId){
  try{
      if(!ventureId){
        const error = new Error("Faltan campos obligatorios");
        error.status = 400;
        throw error;
      }

      const { data: evidences, error } = await supabase
          .from("venture_task_evidences")
          .select("*")
          .eq("venture_id", ventureId);
      
        if(error) throw error;

        return evidences;

  }catch(error){
     throw error;
  }
}

async function uploadEvidenceFile({ body, file, userProfile }) {
  try {
    const { venture_id, task_key, descripcion } = body;


    if (!venture_id || !task_key) {
      const error = new Error("Faltan campos obligatorios");
      error.status = 400;
      throw error;
    }

    if (!file) {
      const error = new Error("No se recibió archivo");
      error.status = 400;
      throw error;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Tipo de archivo no permitido");
      error.status = 400;
      throw error;
    }

    // 📏 Validar tamaño (5MB)
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      const error = new Error("El archivo excede el tamaño permitido");
      error.status = 400;
      throw error;
    }

    const { data: venture, error: ventureError } = await supabase
      .from("ventures")
      .select("perfil_emprendedor_id")
      .eq("id", venture_id)
      .single();

    if (ventureError || !venture) {
      const error = new Error("Emprendimiento no encontrado");
      error.status = 404;
      throw error;
    }

    if (venture.perfil_emprendedor_id !== userProfile.id) {
      const error = new Error("No autorizado");
      error.status = 403;
      throw error;
    }

    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeName = sanitizeFileName(base);

    const filePath = `ventures/${venture_id}/${task_key}/${Date.now()}-${safeName}${ext}`;

    const { error: storageError } = await supabase.storage
      .from("venture-evidences")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (storageError) {
      const error = new Error(storageError.message);
      error.status = 500;
      throw error;
    }

    const { data: publicData } = supabase.storage
      .from("venture-evidences")
      .getPublicUrl(filePath);

    const archivo_url = publicData?.publicUrl || null;

    const { data, error: insertError } = await supabase
      .from("venture_task_evidences")
      .insert([
        {
          venture_id,
          task_key,
          perfil_emprendedor_id: userProfile.id,
          tipo: "archivo",
          descripcion: descripcion || null,
          archivo_url,
          file_path: filePath,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    return data;

  } catch (error) {
    throw error;
  }
}

async function completeTask(taskId, ventureId){
  try{
      if (!taskId) {
        const error = new Error("Se requiere el id de la tarea");
        error.status = 400;
        throw error;
      }

      if (!ventureId) {
        const error = new Error("Se requiere el id del venture");
        error.status = 400;
        throw error;
      }

      const { data: existingEvidence, error: searchError } = await supabase
        .from("venture_task_evidences")
        .select("task_key, estado")
        .eq("task_key", taskId)
        .eq("venture_id", ventureId);

      if (searchError) throw searchError;

      if (!existingEvidence || existingEvidence.length === 0) {
        const error = new Error(
          "No se puede completar la tarea porque no tiene evidencia cargada"
        );
        error.status = 400;
        throw error;
      }

      const { error: updateError } = await supabase
        .from("venture_task_evidences")
        .update({ estado: "completa" })
        .eq("task_key", taskId)
        .eq("venture_id", ventureId);

      if (updateError) throw updateError;

      return true;
  }catch(error){
    throw error;
  }
}

function getTask(taskId){
  for(const stageName in ROADMAP){
    const task = ROADMAP[stageName].tasks.find(t => t.id === taskId);
    if(task){
      return{
        ...task,
        stage: stageName,
      };
    }
  }
  throw new Error("Tarea no encontrada");
}

async function getTasksByStage(stageName, ventureId) {
  try{
    const roadmapTasks = ROADMAP[stageName].tasks;

    const { data: evidences, error } = await supabase
      .from("venture_task_evidences")
      .select("*")
      .eq("venture_id", ventureId);

    if(error) throw error;

    return roadmapTasks.map(task => {
      const evidence = evidences.find(e => String(e.task_key) === String(task.id));
      const isAutoCompleted = !!task.autoCompleted;
      return {
        ...task,
        status: isAutoCompleted
        ? "completa" 
        : evidence?.estado  || "pendiente",
        hasEvidence: isAutoCompleted ? true : !!evidence,
      }
    })
  }catch(error){
    throw error;
  }
}

module.exports = {
  createEvidence,
  getEvidencesByTask,
  uploadEvidenceFile,
  getEvidencesByVentureId,
  completeTask,
  getTask,
  getTasksByStage

};