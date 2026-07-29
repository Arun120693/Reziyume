const data = {
  sectionOrder: ["experience", "education", "skills", "projects", "customSections"],
  sectionVisibility: undefined,
  experience: [{ id: "1" }]
};

const renderSection = (sectionId) => {
  if (!data.sectionVisibility?.[sectionId]) return null;
  return `Rendered ${sectionId}`;
};

const result = data.sectionOrder?.map((sectionId) => renderSection(sectionId)) || [];
console.log(result);
