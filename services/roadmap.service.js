const { ROADMAP } = require("../constants/roadmap");

function getRoadmapByStage(stage){
    return ROADMAP[stage] || ROADMAP["Idea"];
}

function buildTaskWithStatus(tasks, evidences){
    return tasks.map(task => {
        const taskEvidences = evidences.filter(
            e => e.task_key === task.id
        );

        let status = "pendiente";

        if(task.autoCompleted){
            status = "completa";
        }else if(taskEvidences.length > 0){
            if(taskEvidences.some(e => e.estado === "completa")){
                status = "completa";
            }else{
                status = "en progreso";
            }
        }
        return {
            ...task,
            status
        }
    });
}

module.exports = {
    getRoadmapByStage,
    buildTaskWithStatus
}