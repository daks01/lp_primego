import React, { useRef, useState } from 'react';
import styles from './Tooltip.module.scss';
import {
    useFloating,
    autoUpdate,
    arrow,
    offset,
    flip,
    shift,
    useHover,
    useFocus,
    useMergeRefs,
    useRole,
    useInteractions,
    FloatingArrow,
    FloatingPortal,
    autoPlacement,
} from '@floating-ui/react';

const Tooltip: React.FC<{ content: string; children: React.ReactElement }> = ({ content, children }) => {
    const arrowRef = useRef<SVGSVGElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: 'top',
        whileElementsMounted: autoUpdate,
        middleware: [offset(9), flip(), shift(), arrow({ element: arrowRef })],
    });
    const hover = useHover(context, { mouseOnly: true });
    const focus = useFocus(context);
    const role = useRole(context, { role: 'tooltip' });
    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, role]);
    const mergedRefs = useMergeRefs([refs.setReference, (children as any).ref]);
    return (
        <>
            {React.cloneElement(children, { ...getReferenceProps({ ...children.props, ref: mergedRefs }) })}
            <FloatingPortal>
                {isOpen && (
                    <div ref={refs.setFloating} {...getFloatingProps({ className: styles.tooltip, style: floatingStyles })}>
                        <FloatingArrow ref={arrowRef} context={context} className={styles.arrow} />
                        {content}
                    </div>
                )}
            </FloatingPortal>
        </>
    );
};

export default Tooltip;
