import { useState, useEffect } from 'react';
import { LEGACY_SUBJECT_NAME_MAP } from '../data/subjects';

export interface Resource {
  id: string;
  name: string;
  subjectId: string;
}

const STORAGE_KEY = 'jee-resources';
const STORAGE_VERSION = 2;

interface StoredResources {
  version: number;
  resources: Resource[];
}

// Legacy resource type for migration
interface LegacyResource {
  id: string;
  name: string;
  subject?: string;
  subjectId?: string;
}

const DEFAULT_RESOURCES: Resource[] = [
  { id: 'math-cengage', name: 'Cengage Mathematics', subjectId: 'mathematics' },
  { id: 'phys-hcv', name: 'HCV Physics', subjectId: 'physics' },
  { id: 'chem-awasthi', name: 'N. Awasthi Chemistry', subjectId: 'chemistry' },
];

function migrateResources(resources: LegacyResource[]): Resource[] {
  return resources.map(resource => {
    if (resource.subjectId) {
      return resource as Resource;
    }
    // Migrate old subject field to subjectId
    const legacySubject = resource.subject || 'Mathematics';
    const subjectId = LEGACY_SUBJECT_NAME_MAP[legacySubject] || 'mathematics';
    return {
      ...resource,
      subjectId,
    } as Resource;
  });
}

export function useResources(subjectId: string) {
  const [resources, setResources] = useState<Resource[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        
        // Handle versioned storage
        if (data.version === STORAGE_VERSION) {
          const subjectResources = data.resources.filter((r: Resource) => r.subjectId === subjectId);
          // Add defaults if none exist for this subject
          if (subjectResources.length === 0) {
            return DEFAULT_RESOURCES.filter(r => r.subjectId === subjectId);
          }
          return subjectResources;
        }
        
        // Handle legacy storage (array or old version)
        const legacyResources = Array.isArray(data) ? data : (data.resources || []);
        if (legacyResources.length > 0) {
          const migratedResources = migrateResources(legacyResources);
          const subjectResources = migratedResources.filter(r => r.subjectId === subjectId);
          if (subjectResources.length === 0) {
            return DEFAULT_RESOURCES.filter(r => r.subjectId === subjectId);
          }
          return subjectResources;
        }
      }
    } catch (error) {
      console.error('Failed to load resources:', error);
    }
    return DEFAULT_RESOURCES.filter(r => r.subjectId === subjectId);
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : { version: STORAGE_VERSION, resources: [] };
      
      let allResources: Resource[] = [];
      if (data.version === STORAGE_VERSION) {
        allResources = data.resources;
      } else {
        const legacyResources = Array.isArray(data) ? data : (data.resources || []);
        allResources = legacyResources.length > 0 ? migrateResources(legacyResources) : DEFAULT_RESOURCES;
      }
      
      const otherResources = allResources.filter(r => r.subjectId !== subjectId);
      const updatedResources = [...otherResources, ...resources];
      
      const storageData: StoredResources = {
        version: STORAGE_VERSION,
        resources: updatedResources,
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
      console.error('Failed to save resources:', error);
    }
  }, [resources, subjectId]);

  const addResource = (name: string) => {
    const newResource: Resource = {
      id: `${subjectId}-${Date.now()}`,
      name,
      subjectId,
    };
    setResources(prev => [...prev, newResource]);
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
  };

  return {
    resources,
    addResource,
    deleteResource,
  };
}
