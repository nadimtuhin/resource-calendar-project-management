import { Project } from '../types';

export interface ContiguousProjectGroup {
  project: Project;
  startIndex: number;
  endIndex: number;
  span: number;
}

export const groupContiguousProjects = (
  projects: Project[],
  dates: Date[],
  resourceId: string
): ContiguousProjectGroup[] => {
  const groups: ContiguousProjectGroup[] = [];
  const dateStrings = dates.map(date => date.toISOString().split('T')[0]);
  
  // Track which dates have been processed for each project
  const processedRanges = new Map<string, Set<number>>();
  
  projects.forEach(project => {
    if (project.resourceId !== resourceId) return;
    
    // Find all date indices where this project appears
    const projectIndices: number[] = [];
    dateStrings.forEach((dateStr, index) => {
      if (project.startDate <= dateStr && project.endDate >= dateStr) {
        projectIndices.push(index);
      }
    });
    
    if (projectIndices.length === 0) return;
    
    // Group contiguous indices
    let startIdx = projectIndices[0];
    let currentIdx = startIdx;
    
    for (let i = 1; i <= projectIndices.length; i++) {
      if (i === projectIndices.length || projectIndices[i] !== currentIdx + 1) {
        // End of contiguous group
        const endIdx = currentIdx;
        
        // Check if this range has already been processed for this project
        if (!processedRanges.has(project.id)) {
          processedRanges.set(project.id, new Set());
        }
        
        if (!processedRanges.get(project.id)!.has(startIdx)) {
          groups.push({
            project,
            startIndex: startIdx,
            endIndex: endIdx,
            span: endIdx - startIdx + 1
          });
          
          // Mark all indices in this range as processed
          for (let j = startIdx; j <= endIdx; j++) {
            processedRanges.get(project.id)!.add(j);
          }
        }
        
        // Start new group if there are more indices
        if (i < projectIndices.length) {
          startIdx = projectIndices[i];
          currentIdx = startIdx;
        }
      } else {
        currentIdx = projectIndices[i];
      }
    }
  });
  
  // Sort by start index for consistent rendering
  return groups.sort((a, b) => a.startIndex - b.startIndex);
};