import { Gear } from '@phosphor-icons/react';

import { useSettings } from '@/hooks/use-settings';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingsAPIKey } from '@/components/settings-apikey';
import { SettingsModel } from '@/components/settings-model';
import { SettingsSpeech } from '@/components/settings-speech';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { apiCustomEnabled, tts } = useSettings();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Gear className="mr-2 size-6" />
            Settings
          </DialogTitle>
        </DialogHeader>
        <Separator className="my-1" />
        <Tabs defaultValue="models">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="models">Models</TabsTrigger>
            {tts.enabled && <TabsTrigger value="speech">Speech</TabsTrigger>}
            {apiCustomEnabled && (
              <TabsTrigger value="apikeys">API Keys & Providers</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="models" className="px-px">
            <SettingsModel />
          </TabsContent>
          {tts.enabled && (
            <TabsContent value="speech" className="px-px">
              <SettingsSpeech />
            </TabsContent>
          )}
          {apiCustomEnabled && (
            <TabsContent value="apikeys" className="px-px">
              <SettingsAPIKey />
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
