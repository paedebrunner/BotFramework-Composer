// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { useRecoilValue } from 'recoil';
import formatMessage from 'format-message';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';

import { FieldConfig, useForm } from '../../hooks/useForm';
import { dispatcherState, showCreateQnAFromUrlDialogState } from '../../recoilModel';

import { validateName, CreateQnAFromModalProps, CreateQnAFromScratchFormData } from './constants';
import { subText, styles, dialogWindow, textField } from './styles';

const formConfig: FieldConfig<CreateQnAFromScratchFormData> = {
  name: {
    required: true,
    defaultValue: '',
  },
};

const DialogTitle = () => {
  return (
    <div>
      {formatMessage('Create new knowledge base from scratch')}
      <p>
        <span css={subText}>{formatMessage('Manually add question and answer pairs to create a KB')}</span>
      </p>
    </div>
  );
};

export const CreateQnAFromScratchModal: React.FC<CreateQnAFromModalProps> = (props) => {
  const { onDismiss, onSubmit, qnaFiles, dialogId } = props;
  const actions = useRecoilValue(dispatcherState);
  const showCreateQnAFromUrlDialog = useRecoilValue(showCreateQnAFromUrlDialogState);

  formConfig.name.validate = validateName(qnaFiles);
  const { formData, updateField, hasErrors, formErrors } = useForm(formConfig);
  const disabled = hasErrors;

  const updateName = (name = '') => {
    updateField('name', name);
  };

  return (
    <Dialog
      dialogContentProps={{
        type: DialogType.normal,
        title: <DialogTitle />,
        styles: styles.dialog,
      }}
      hidden={false}
      modalProps={{
        isBlocking: false,
        styles: styles.modal,
      }}
      onDismiss={onDismiss}
    >
      <div css={dialogWindow}>
        <Stack>
          <TextField
            data-testid={`knowledgeLocationTextField-name`}
            errorMessage={formErrors.name}
            label={formatMessage('Knowledge base name')}
            placeholder={formatMessage('Type a name that describes this content')}
            styles={textField}
            value={formData.name}
            onChange={(e, name) => updateName(name)}
          />
        </Stack>
      </div>
      <DialogFooter>
        {showCreateQnAFromUrlDialog && (
          <DefaultButton
            text={formatMessage('Back')}
            onClick={() => {
              actions.createQnAFromScratchDialogCancel(dialogId);
            }}
          />
        )}
        <DefaultButton
          text={formatMessage('Cancel')}
          onClick={() => {
            actions.createQnAFromScratchDialogCancel();
            onDismiss && onDismiss();
          }}
        />
        <PrimaryButton
          data-testid={'createKnowledgeBase'}
          disabled={disabled}
          text={formatMessage('Create KB')}
          onClick={() => {
            if (hasErrors) {
              return;
            }
            onSubmit(formData);
          }}
        />
      </DialogFooter>
    </Dialog>
  );
};

export default CreateQnAFromScratchModal;
