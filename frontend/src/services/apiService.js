import api from "../api";

export const updateTopic = (topicId, data) => {
  return api.put(`topics/${topicId}/`, data);
};

export const updateSection = (sectionId, data) => {
  return api.put(`sections/${sectionId}/`, data);
};

export const updateCourse = (courseId, data) => {
  return api.put(`courses/${courseId}/`, data);
};
