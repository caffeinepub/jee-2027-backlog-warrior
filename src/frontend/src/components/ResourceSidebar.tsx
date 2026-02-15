import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Trash2, Plus, BookOpen } from 'lucide-react';
import { useResources } from '../hooks/useResources';

interface ResourceSidebarProps {
  subjectId: string;
  subjectName: string;
}

export function ResourceSidebar({ subjectId, subjectName }: ResourceSidebarProps) {
  const { resources, addResource, deleteResource } = useResources(subjectId);
  const [newResource, setNewResource] = useState('');

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (newResource.trim()) {
      addResource(newResource.trim());
      setNewResource('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{subjectName} - Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddResource} className="flex gap-2">
          <Input
            placeholder="Add a new resource..."
            value={newResource}
            onChange={(e) => setNewResource(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="space-y-2">
          {resources.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No resources yet. Add one to get started!
            </p>
          ) : (
            resources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="flex-1">{resource.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteResource(resource.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
