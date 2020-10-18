import { CONTAINER_ESO } from '../../data/constantes';

export const layerGrid01 = {
  id: 'grid-01',
  nature: 'layer',
  initial: {
    statStyle: {
      position: 'static',
      top: 0,
      left: 0,
      display: 'grid',
      margin: '2rem',
      gridTemplateColumns: '6fr 4fr',
      gridTemplateRows: '4fr 3fr repeat(3, 1fr)',
      width: 'calc(100% - 4rem)',
      height: 'calc(100vmin - 8rem)',
    },
    content: [
      {
        id: 's01',
        statStyle: {
          'grid-column': '1 / 3',
          'grid-row': 1,
        },
      },
      {
        id: 's02',
        statStyle: {
          'grid-column': 1,
          'grid-row': '2 / 6',
        },
      },
      { id: 's03', statStyle: { 'grid-row': 2 } },
      { id: 's04', statStyle: { 'grid-column': 2 } },
      { id: 's05', statStyle: { 'grid-column': 2 } },
      { id: 's06', statStyle: { 'grid-column': 2 } },
    ],
  },
  listen: [{ event: 'go', action: 'enter' }],
  actions: [
    {
      name: 'enter',
      move: { layer: CONTAINER_ESO, slot: CONTAINER_ESO + '_s01' },
      transition: { to: 'fadeIn' },
    },
  ],
};
