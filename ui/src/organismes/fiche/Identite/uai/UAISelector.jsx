import { useModal } from '../../../../common/dsfr/common/useModal';
import LinkButton from '../../../../common/dsfr/custom/LinkButton';
import ValidationTag from '../../../../common/ValidationTag';
import { UAISelectorModal } from './UAISelectorModal';
import { Button } from '../../../../common/dsfr/elements/Button';


const actions = {
  A_VALIDER:    {
    actionName:   'Choisir l\'UAI',
    label:        'à valider',
    legend:       'Quelle UAI souhaitez-vous utiliser pour immatriculer cet organisme de formation ?',
    ActionButton: function({ label, onClick, children }) {
      return (
        <div className={'fr-mt-3w'}>
          <Button modifiers={'sm icon-left'} icons={'edit-line'} onClick={onClick}>
            {label}
          </Button>
          {children}
        </div>
      );
    },
  },
  A_RENSEIGNER: {
    actionName:   'Renseigner une UAI',
    label:        'à renseigner',
    legend:       'Quelle UAI souhaitez-vous utiliser pour immatriculer cet organisme de formation ?',
    ActionButton: function({ label, onClick, children }) {
      return (
        <div className={'fr-mt-3w'}>
          <Button modifiers={'sm icon-left'} icons={'edit-line'} onClick={onClick}>
            {label}
          </Button>
          {children}
        </div>
      );
    },
  },
  VALIDE:       {
    actionName:   'Modifier l\'UAI',
    label:        'validée',
    legend:       'Par quelle UAI souhaitez-vous remplacer l’UAI validée ?',
    ActionButton: function({ label, onClick, children }) {
      return (
        <>
          <LinkButton modifiers={'sm icon-left'} icons={'edit-line'} onClick={onClick}>
            {label}
          </LinkButton>
          {children}
        </>
      );
    },
  },
};

export default function UAIValidator ({ organisme, ...rest }) {
  const modal = useModal();
  const type = organisme.uai ? 'VALIDE' : organisme.uai_potentiels.length > 0 ? 'A_VALIDER' : 'A_RENSEIGNER';
  const action = actions[type];
  const { label, ActionButton } = action;

  return (
    <div {...rest}>
      <ValidationTag type={type} label={label} className="fr-mr-3v" />
      <ActionButton label={action.actionName} onClick={() => modal.open()}>
        <UAISelectorModal organisme={organisme} modal={modal} action={action} />
      </ActionButton>
    </div>
  );
}
