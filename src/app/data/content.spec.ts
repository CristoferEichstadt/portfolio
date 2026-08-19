import { projects } from './content';

describe('projects', () => {
  it('inclui o CRM de manutenção industrial como case de autoria integral', () => {
    const edda = projects.find(project => project.id === 'edda-sistema');

    expect(edda).toBeDefined();
    expect(edda?.role).toBe('secondary');
    expect(edda?.subHuman).toContain('CRM completo');
    expect(edda?.bulletsHuman).toContain('Centraliza clientes, orçamentos e o histórico de cada serviço');
    expect(edda?.stack).toEqual(jasmine.arrayContaining(['React', 'Node.js', 'PostgreSQL', 'Docker']));
  });
});
