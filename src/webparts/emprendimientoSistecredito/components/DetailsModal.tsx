import * as React from 'react';
import { useId, useBoolean } from '@fluentui/react-hooks';
import {
    getTheme,
    mergeStyleSets,
    FontWeights,
    Modal,
    IIconProps,
    IStackProps,
} from '@fluentui/react';
import { IconButton, IButtonStyles } from '@fluentui/react/lib/Button';
import styles from './EmprendimientoSistecredito.module.scss';

export const DetailsModal = (props) => {

    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
    const [isPopup, setisPopup] = React.useState(true);
    const titleId = useId('title');
    const prueba=props.props.change;

    React.useEffect(() => {
        showModal();
    }, [isPopup]);

    function ExitHandler() {
        hideModal();
        setisPopup(current => !current);
        props.handler();
    }

    return (
        <div>
            <Modal
                titleAriaId={titleId}
                isOpen={isModalOpen}
                onDismiss={ExitHandler}
                isBlocking={true}
                containerClassName={styles.emprendimientos__contenido}
            >
                <div>
                    <span id={titleId}>{prueba}</span>
                    <IconButton
                        // styles={iconButtonStyles}
                        iconProps={cancelIcon}
                        ariaLabel='Cerrar popup modal'
                        onClick={ExitHandler}
                    />
                </div>


            </Modal>
        </div>
    )
}

const theme = getTheme();
const cancelIcon: IIconProps = { iconName: 'Cancel' };

const iconButtonStyles: Partial<IButtonStyles> = {
    root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px',
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};