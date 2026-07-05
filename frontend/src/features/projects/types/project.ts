export type ProjectItemType = 'link' | 'note' | 'snippet' | 'prompt' | 'infrastructure' | 'file';

export interface Project {
    id: number;
    title: string;
    description?: string;
    color?: string;
    emoji?: string;
    itemCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectItem {
    itemType: ProjectItemType;
    itemId: number;
    sortOrder: number;
    addedAt: string;
    item: any | null;
}

export interface ProjectDetail extends Project {
    items: ProjectItem[];
}

export interface CreateProjectDto {
    title: string;
    description?: string;
    color?: string;
    emoji?: string;
}

export const PROJECT_COLORS: { value: string; label: string; css: string }[] = [
    { value: 'cyan',   label: 'Cyan',   css: 'var(--cyan-400)' },
    { value: 'purple', label: 'Purple', css: '#a78bfa' },
    { value: 'orange', label: 'Orange', css: '#fb923c' },
    { value: 'green',  label: 'Green',  css: '#34d399' },
    { value: 'red',    label: 'Red',    css: '#f87171' },
    { value: 'yellow', label: 'Yellow', css: '#fbbf24' },
    { value: 'pink',   label: 'Pink',   css: '#f472b6' },
    { value: 'gray',   label: 'Gray',   css: 'var(--text-muted)' },
];

export const PROJECT_COLOR_CSS: Record<string, string> = Object.fromEntries(
    PROJECT_COLORS.map(c => [c.value, c.css])
);

export const ITEM_TYPE_LABELS: Record<ProjectItemType, string> = {
    link: 'Links',
    note: 'Notes',
    snippet: 'Snippets',
    prompt: 'Prompts',
    infrastructure: 'Infra',
    file: 'Files',
};
