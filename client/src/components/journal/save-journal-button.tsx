import { Loader2, Save } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

interface SaveJournalButtonProps {
  isSaving: boolean;
  saveSuccess: boolean;
  handleSaveJournal: () => void;
}

const SaveJournalButton: React.FC<SaveJournalButtonProps> = ({
  isSaving,
  saveSuccess,
  handleSaveJournal,
}) => {
  let buttonContent: React.ReactNode;

  if (isSaving) {
    buttonContent = (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Saving...
      </>
    );
  } else if (saveSuccess) {
    buttonContent = <>✅ Saved Successfully!</>;
  } else {
    buttonContent = (
      <>
        <Save className="mr-2 h-4 w-4" />
        💾 Save Journal
      </>
    );
  }

  return (
    <Button
      onClick={handleSaveJournal}
      disabled={isSaving}
      className="w-full max-w-xs"
      variant={saveSuccess ? 'outline' : 'default'}
    >
      {buttonContent}
    </Button>
  );
};

export default SaveJournalButton;
