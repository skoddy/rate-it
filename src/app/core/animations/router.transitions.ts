import {
    animate,
    query,
    style,
    transition,
    trigger,
    stagger,
    sequence
} from '@angular/animations';

export const ANIMATE_ON_ROUTE_ENTER = 'route-enter-staggered';

export const routerTransition = trigger('routerTransition', [
    transition('* <=> *', [
        query(':enter > *', style({ opacity: 0, position: 'fixed' }), {
            optional: true
        }),
        query(':enter .' + ANIMATE_ON_ROUTE_ENTER, style({ opacity: 0 }), {
            optional: true
        }),
        sequence([
            query(
                ':leave > *',
                [
                    style({ opacity: 1 }),
                    animate(
                        '0.2s ease-in-out',
                        style({ opacity: 0 })
                    ),
                    style({ position: 'fixed' })
                ],
                { optional: true }
            ),
            query(
                ':enter > *',
                [
                    style({
                        opacity: 0,
                        position: 'static'
                    }),
                    animate(
                        '0.3s ease-in-out',
                        style({ opacity: 1 })
                    )
                ],
                { optional: true }
            )
        ]),
        query(
            ':enter .' + ANIMATE_ON_ROUTE_ENTER,
            stagger(400, [
                style({ transform: 'translateY(15%)', opacity: 0 }),
                animate(
                    '1s ease-in-out',
                    style({ transform: 'translateY(0%)', opacity: 1 })
                )
            ]),
            { optional: true }
        )
    ])
]);
