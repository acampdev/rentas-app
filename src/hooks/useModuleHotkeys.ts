// src/hooks/useModuleHotkeys.ts
import { useEffect, useRef } from 'react';
import { useCommands, Command } from '../context/CommandContext';
import { useHotkeys, HotkeyConfig } from './useHotkeys';

interface ModuleHotkeyConfig {
  id: string;
  name: string;
  description: string;
  hotkey: HotkeyConfig;
  action: () => void;
  enabled?: boolean;
  icon?: string;
}

/**
 * Hook que combina el registro de comandos en el Command Manager
 * y la escucha de hotkeys para un módulo específico
 */
export const useModuleHotkeys = (
  moduleName: string,
  configs: ModuleHotkeyConfig[]
) => {
  const { registerCommand, unregisterCommand, setActiveModule } = useCommands();
  const configsRef = useRef(configs);
  configsRef.current = configs;

  // Registrar comandos en el Command Manager
  useEffect(() => {
    setActiveModule(moduleName);

    const commands: Command[] = configsRef.current.map(config => ({
      ...config,
      module: moduleName,
      action: () => configsRef.current.find(current => current.id === config.id)?.action(),
    }));

    // Registrar todos los comandos
    commands.forEach(cmd => registerCommand(cmd));

    console.log(`⌨️  [${moduleName}] ${commands.length} atajos de teclado registrados`);

    // Cleanup
    return () => {
      commands.forEach(cmd => unregisterCommand(cmd.id));
    };
  }, [moduleName, registerCommand, unregisterCommand, setActiveModule]);

  // Escuchar hotkeys
  useHotkeys(
    configs.map(config => config.hotkey),
    (event: KeyboardEvent) => {
      // Encontrar qué comando se ejecutó
      for (const config of configsRef.current) {
        const hotkey = config.hotkey;

        const keyMatch =
          event.key.toLowerCase() === hotkey.key.toLowerCase() ||
          event.code.toLowerCase() === hotkey.key.toLowerCase();

        const ctrlMatch = hotkey.ctrl ? event.ctrlKey : !event.ctrlKey;
        const altMatch = hotkey.alt ? event.altKey : !event.altKey;
        const shiftMatch = hotkey.shift ? event.shiftKey : !event.shiftKey;
        const metaMatch = hotkey.meta ? event.metaKey : !event.metaKey;

        if (keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch) {
          if (config.enabled !== false) {
            console.log(`⚡ [${moduleName}] Ejecutando: ${config.name}`);
            config.action();
          }
          break;
        }
      }
    },
    []
  );
};
