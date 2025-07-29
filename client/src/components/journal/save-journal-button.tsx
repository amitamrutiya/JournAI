import { Edit, Loader2, Save } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

interface SaveJournalButtonProps {
  isSaving: boolean;
  saveSuccess: boolean;
  handleSaveJournal: () => void;
  isUpdateMode?: boolean; // True when we should show "Update" instead of "Save"
}

const SaveJournalButton: React.FC<SaveJournalButtonProps> = ({
  isSaving,
  saveSuccess,
  handleSaveJournal,
  isUpdateMode = false,
}) => {
  let buttonContent: React.ReactNode;

  if (isSaving) {
    buttonContent = (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {isUpdateMode ? 'Updating...' : 'Saving...'}
      </>
    );
  } else if (saveSuccess) {
    buttonContent = (
      <>✅ {isUpdateMode ? 'Updated Successfully!' : 'Saved Successfully!'}</>
    );
  } else {
    buttonContent = (
      <>
        {isUpdateMode ? (
          <Edit className="mr-2 h-4 w-4" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        {isUpdateMode ? '📝 Update Journal' : '💾 Save Journal'}
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
