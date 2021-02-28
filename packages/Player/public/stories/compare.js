[
	{
		id: 'scene1',
		name: 'introduction',
		entry: 'scene-w-telco',
		cast: [
			{
				id: 'story01',
				startAt: 'go2',
				root: 'telco',
			},
			{
				id: 'story02',
				startAt: 'go1',
				root: 'main',
			},
		],
		stories: [
			{
				id: 'scene-w-telco',
				channel: 'main',
				entry: 'eso',
				stage: {
					w: 1200,
					h: 900,
					r: 1.3333333333333333,
				},
				eventimes: {
					channel: 'main',
					startAt: 0,
					name: 'go1',
					events: [
						{
							channel: 'main',
							startAt: 1500,
							name: 'go2',
						},
					],
				},
				persos: [
					{
						nature: 'layer',
						id: 'eso',
						initial: {
							className: 'container layer-top ',
							classStyle: {
								display: 'grid',
								'grid-template-columns': '5fr 5fr',
							},
							content: [
								{
									id: 'main',
									classStyle: {
										display: 'grid',
										'grid-column': 1,
										overflow: 'hidden',
									},
								},
								{
									id: 'telco',
									classStyle: {
										display: 'grid',
										'grid-column': 2,
									},
								},
							],
						},
						actions: [
							{
								name: 'end-scene',
								leave: true,
							},
						],
						listen: [
							{
								event: 'end-scene',
								action: 'end-scene',
								channel: 'main',
							},
						],
					},
				],
				isEntry: true,
				root: 'eso',
			},
			{
				id: 'story01',
				entry: ['story01_fond', 'story01_grid-01'],
				stage: {
					w: 1200,
					h: 900,
					r: 1.3333333333333333,
				},
				eventimes: {
					channel: 'main',
					startAt: 'go2',
					name: 'start',
					events: [
						{
							channel: 'story01',
							startAt: 0,
							name: 'go',
							data: ['un', 'deux', 'trois'],
						},
						{
							channel: 'story01',
							startAt: 500,
							name: 'ev011',
						},
						{
							channel: 'story01',
							startAt: 1000,
							name: 'ev012',
						},
						{
							channel: 'story01',
							startAt: 2000,
							name: 'ev013',
						},
						{
							channel: 'story01',
							startAt: 3000,
							name: 'ev014',
						},
						{
							channel: 'story01',
							startAt: 4000,
							name: 'ev015',
						},
						{
							channel: 'story01',
							startAt: 5000,
							name: 'leave-root',
							events: [
								{
									channel: 'story01',
									startAt: 1000,
									name: 'bye',
									data: ['quatre', 'cinq', 'six'],
								},
							],
						},
						{
							channel: 'story01',
							startAt: 7000,
							name: 'end-story',
						},
						{
							channel: 'main',
							startAt: 7000,
							name: 'end-story01',
						},
					],
				},
				channel: 'story01',
				persos: [
					{
						nature: 'layer',
						id: 'story01_fond',
						initial: {
							classStyle: {
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								display: 'grid',
								gridColumn: 1,
								gridRow: 1,
								backgroundColor: 'cyan',
							},
							content: [
								{
									id: 'story01_fond_s01',
								},
							],
							className: 'undefined layer-top  layer-top ',
						},
						actions: [
							{
								name: 'end-story',
								exit: true,
								transition: {
									to: 'fadeOut',
								},
							},
							{
								name: 'leave-fond',
								leave: true,
							},
							{
								name: 'enter',
								move: {
									slot: 'telco',
								},
								transition: {
									to: 'fadeIn',
								},
							},
						],
						listen: [
							{
								event: 'end-story',
								action: 'end-story',
							},
							{
								event: 'leave-fond',
								action: 'leave-fond',
							},
							{
								event: 'go2',
								action: 'enter',
								channel: 'main',
							},
						],
					},
					{
						nature: 'layer',
						id: 'story01_grid-01',
						initial: {
							classStyle: {
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								display: 'grid',
								margin: '2rem',
								gridTemplateColumns: '6fr 4fr',
								gridTemplateRows: '4fr 3fr repeat(3, 1fr)',
							},
							content: [
								{
									id: 'story01_grid-01_s01',
									classStyle: {
										gridColumn: '1 / 3',
										gridRow: 1,
									},
								},
								{
									id: 'story01_grid-01_s02',
									classStyle: {
										gridColumn: 1,
										gridRow: '2 / 6',
									},
								},
								{
									id: 'story01_grid-01_s03',
									classStyle: {
										gridRow: 2,
									},
								},
								{
									id: 'story01_grid-01_s04',
									classStyle: {
										gridColumn: 2,
									},
								},
								{
									id: 'story01_grid-01_s05',
									classStyle: {
										gridColumn: 2,
									},
								},
								{
									id: 'story01_grid-01_s06',
									classStyle: {
										gridColumn: 2,
									},
								},
							],
							className: 'undefined layer-top  layer-top ',
						},
						actions: [
							{
								name: 'end-story',
								leave: true,
								transition: {
									to: 'fadeOut',
									oncomplete: [
										{
											event: {
												channel: 'main',
												name: 'leave-undefined',
											},
										},
										{
											event: {
												channel: 'main',
												name: 'leave-undefined',
											},
										},
									],
								},
							},
							{
								name: 'enter',
								move: {
									slot: 'telco',
								},
								transition: {
									to: 'fadeIn',
								},
							},
						],
						listen: [
							{
								event: 'end-story',
								action: 'end-story',
							},
							{
								event: 'go2',
								action: 'enter',
								channel: 'main',
							},
						],
					},
					{
						nature: 'bloc',
						id: 'story01_text-sample',
						initial: {
							className: 'bloc-center totoo',
							classStyle: {
								color: 'blue',
								'font-weight': 'bold',
								padding: '8px 24px',
								'&:hover': {
									cursor: 'grab',
								},
							},
							attr: {
								'data-letter': 'alphabet',
							},
							content: 'scene1',
						},
						emit: {
							mousedown: {
								event: {
									channel: 'strap',
									name: 'move',
								},
								data: {
									id: 'story01_text-sample',
									event: 'move-toto',
								},
							},
						},
						listen: [
							{
								event: 'ev011',
								action: 'enter',
							},
							{
								event: 'ev012',
								action: 'step01',
							},
							{
								event: 'ev014',
								action: 'step02',
							},
							{
								channel: 'main',
								event: 'move-toto',
								action: 'idle',
							},
						],
						actions: [
							{
								name: 'idle',
							},
							{
								name: 'enter',
								move: {
									slot: 'story01_grid-01_s01',
								},
								classStyle: {
									fontSize: 64,
									backgroundColor: '#ffff00',
									position: 'absolute',
								},
								style: {
									scale: 0.5,
								},
							},
							{
								name: 'step01',
								content: 'story01',
								move: {
									slot: 'story01_grid-01_s02',
									rescale: true,
								},
								transition: {
									to: {
										x: 100,
										y: 100,
										rotate: 200,
										scale: 0.4,
										fontSize: 100,
										backgroundColor: '#00ffff',
										color: '#0033FF',
									},
									duration: 2000,
								},
							},
							{
								name: 'step02',
								move: {
									slot: 'story01_grid-01_s03',
									rescale: true,
								},
								transition: {
									to: {
										scale: 1.5,
										rotate: 40,
										fontSize: 150,
										backgroundColor: '#00ff00',
										color: '#3300FF',
									},
									duration: 1000,
								},
								content: 'story01_text-sample',
							},
						],
					},
					{
						nature: 'img',
						id: 'story01_image',
						initial: {
							content: './ikono/vignette.jpg',
							fit: 'cover',
							classStyle: {
								position: 'absolute',
							},
							dimensions: {
								width: '100%',
								height: '100%',
							},
						},
						emit: {
							click: [
								{
									event: {
										channel: 'TC',
										name: 'pause',
									},
								},
							],
						},
						listen: [
							{
								event: 'go',
								action: 'enter',
							},
							{
								event: 'ev012',
								action: 'step01',
							},
							{
								event: 'ev014',
								action: 'step02',
							},
							{
								event: 'end-rescale-image',
								action: 'end-rescale-image',
							},
						],
						actions: [
							{
								name: 'end-rescale-image',
								style: {
									outline: '20px solid red',
								},
							},
							{
								name: 'enter',
								move: {
									slot: 'story01_grid-01_s03',
								},
								transition: {
									to: 'fadeIn',
								},
							},
							{
								name: 'step01',
								move: {
									slot: 'story01_fond_s01',
									rescale: true,
								},
								transition: {
									to: {
										opacity: 0.5,
									},
								},
							},
							{
								name: 'step02',
								move: {
									slot: 'story01_grid-01_s02',
									rescale: true,
								},
								transition: {
									to: {
										opacity: 1,
									},
								},
							},
						],
					},
					{
						nature: 'img',
						id: 'story01_image2',
						initial: {
							content: './ikono/perfume_002.jpg',
							fit: 'cover',
							classStyle: {
								position: 'absolute',
							},
						},
						listen: [
							{
								event: 'go',
								action: 'enter',
							},
							{
								event: 'ev011',
								action: 'step01',
							},
							{
								event: 'ev013',
								action: 'step02',
							},
							{
								event: 'end-rescale-image2',
								action: 'end-rescale-image2',
							},
						],
						actions: [
							{
								name: 'end-rescale-image2',
								style: {
									outline: '20px solid blue',
								},
							},
							{
								name: 'enter',
								move: {
									slot: 'story01_grid-01_s02',
								},
							},
							{
								name: 'step01',
								move: {
									slot: 'story01_grid-01_s01',
									rescale: true,
								},
								transition: {
									to: {
										opacity: 0.5,
									},
								},
							},
							{
								name: 'step02',
								move: {
									slot: 'story01_fond_s01',
									rescale: true,
								},
								transition: {
									to: {
										opacity: 1,
									},
								},
							},
						],
					},
					{
						nature: 'button',
						id: 'story01_togglePlay',
						initial: {
							classStyle: {
								color: 'white',
								backgroundColor: 'green',
								borderRadius: '4px',
								fontWeight: 'bold',
								fontSize: '12px',
								padding: '1rem',
								textTransform: 'uppercase',
								textAlign: 'center',
								transition: 'color 0.3s',
								'&:hover': {
									color: 'cyan',
								},
							},
							content: 'pause',
						},
						listen: [
							{
								event: 'go',
								action: 'enter',
							},
							{
								channel: 'telco',
								event: 'play',
								action: 'play',
							},
							{
								channel: 'telco',
								event: 'pause',
								action: 'pause',
							},
						],
						actions: [
							{
								name: 'enter',
								move: {
									slot: 'story01_grid-01_s05',
								},
							},
							{
								name: 'play',
								content: 'pause',
							},
							{
								name: 'pause',
								content: 'play',
							},
						],
						emit: {
							click: {
								event: {
									channel: 'strap',
									name: 'toggle',
								},
								data: {
									id: 'telco',
									event: {
										channel: 'telco',
										name: ['pause', 'play'],
									},
								},
							},
						},
					},
					{
						nature: 'sprite',
						id: 'story01_sprite',
						initial: {
							content: './ikono/Mystery-80.png',
							dimensions: {
								height: 300,
							},
							classStyle: {
								opacity: 0,
							},
						},
						listen: [
							{
								event: 'ev011',
								action: 'enter',
							},
							{
								event: 'ev013',
								action: 'step01',
							},
							{
								event: 'ev015',
								action: 'exit',
							},
							{
								channel: 'main',
								event: 'move-sprite',
								action: 'idle',
							},
							{
								event: 'leave-sprite',
								action: 'leave',
							},
						],
						actions: [
							{
								name: 'enter',
								move: {
									slot: 'story01_grid-01_s03',
								},
								transition: {
									to: {
										opacity: 1,
										x: -100,
										y: 10,
									},
								},
							},
							{
								name: 'step01',
								move: {
									slot: 'story01_grid-01_s01',
								},
								transition: {
									to: {
										x: 100,
										y: 50,
										rotate: 15,
									},
								},
							},
							{
								name: 'exit',
								exit: true,
								transition: {
									to: 'fadeOut',
								},
							},
							{
								name: 'leave',
								leave: true,
							},
							{
								name: 'idle',
							},
						],
						emit: {
							mousedown: {
								event: {
									channel: 'strap',
									name: 'move',
								},
								data: {
									id: 'sprite',
									event: 'move-sprite',
								},
							},
						},
					},
				],
				root: 'telco',
			},
			{
				id: 'story02',
				entry: ['story02_fond', 'story02_grid-01'],
				stage: {
					w: 1200,
					h: 900,
					r: 1.3333333333333333,
				},
				eventimes: {
					channel: 'main',
					startAt: 'go1',
					name: 'start',
					events: [
						{
							channel: 'story02',
							startAt: 0,
							name: 'go',
							data: ['un', 'deux', 'trois'],
						},
						{
							channel: 'story02',
							startAt: 500,
							name: 'ev011',
						},
						{
							channel: 'story02',
							startAt: 1000,
							name: 'ev012',
						},
						{
							channel: 'story02',
							startAt: 2000,
							name: 'ev013',
						},
						{
							channel: 'story02',
							startAt: 3000,
							name: 'ev014',
						},
						{
							channel: 'story02',
							startAt: 4000,
							name: 'ev015',
						},
						{
							channel: 'story02',
							startAt: 5000,
							name: 'leave-root',
							events: [
								{
									channel: 'story02',
									startAt: 1000,
									name: 'bye',
									data: ['quatre', 'cinq', 'six'],
								},
							],
						},
						{
							channel: 'story02',
							startAt: 7000,
							name: 'end-story',
						},
						{
							channel: 'main',
							startAt: 7000,
							name: 'end-story02',
						},
					],
				},
				channel: 'story02',
				persos: [
					{
						nature: 'layer',
						id: 'story02_fond',
						initial: {
							classStyle: {
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								display: 'grid',
								gridColumn: 1,
								gridRow: 1,
								backgroundColor: 'cyan',
							},
							content: [
								{
									id: 'story01_fond_s01',
								},
							],
							className: 'undefined layer-top  layer-top ',
						},
						actions: [
							{
								name: 'end-story',
								exit: true,
								transition: {
									to: 'fadeOut',
								},
							},
							{
								name: 'leave-fond',
								leave: true,
							},
							{
								name: 'enter',
								move: {
									slot: 'main',
								},
								transition: {
									to: 'fadeIn',
								},
							},
						],
						listen: [
							{
								event: 'end-story',
								action: 'end-story',
							},
							{
								event: 'leave-fond',
								action: 'leave-fond',
							},
							{
								event: 'go1',
								action: 'enter',
								channel: 'main',
							},
						],
					},
					{
						nature: 'layer',
						id: 'story02_grid-01',
						initial: {
							classStyle: {
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								display: 'grid',
								margin: '2rem',
								gridTemplateColumns: '6fr 4fr',
								gridTemplateRows: '4fr 3fr repeat(3, 1fr)',
							},
							content: [
								{
									id: 'story01_grid-01_s01',
									classStyle: {
										gridColumn: '1 / 3',
										gridRow: 1,
									},
								},
								{
									id: 'story01_grid-01_s02',
									classStyle: {
										gridColumn: 1,
										gridRow: '2 / 6',
									},
								},
								{
									id: 'story01_grid-01_s03',
									classStyle: {
										gridRow: 2,
									},
								},
								{
									id: 'story01_grid-01_s04',
									classStyle: {
										gridColumn: 2,
									},
								},
								{
									id: 'story01_grid-01_s05',
									classStyle: {
										gridColumn: 2,
									},
								},
								{
									id: 'story01_grid-01_s06',
									classStyle: {
										gridColumn: 2,
									},
								},
							],
							className: 'undefined layer-top  layer-top ',
						},
						actions: [
							{
								name: 'end-story',
								leave: true,
								transition: {
									to: 'fadeOut',
									oncomplete: [
										{
											event: {
												channel: 'main',
												name: 'leave-undefined',
											},
										},
										{
											event: {
												channel: 'main',
												name: 'leave-undefined',
											},
										},
									],
								},
							},
							{
								name: 'enter',
								move: {
									slot: 'main',
								},
								transition: {
									to: 'fadeIn',
								},
							},
						],
						listen: [
							{
								event: 'end-story',
								action: 'end-story',
							},
							{
								event: 'go1',
								action: 'enter',
								channel: 'main',
							},
						],
					},
					{
						nature: 'bloc',
						id: 'story02_text-sample',
						initial: {
							className: 'bloc-center totoo',
							classStyle: {
								color: 'blue',
								'font-weight': 'bold',
								padding: '8px 24px',
								'&:hover': {
									cursor: 'grab',
								},
							},
							attr: {
								'data-letter': 'alphabet',
							},
							content: 'scene1',
						},
						emit: {
							mousedown: {
								event: {
									channel: 'strap',
									name: 'move',
								},
								data: {
									id: 'story01_text-sample',
									event: 'move-toto',
								},
							},
						},
						listen: [
							{
								event: 'ev011',
								action: 'enter',
							},
							{
								event: 'ev012',
								action: 'step01',
							},
							{
								event: 'ev014',
								action: 'step02',
							},
							{
								channel: 'main',
								event: 'move-toto',
								action: 'idle',
							},
						],
						actions: [
							{
								name: 'idle',
							},
							{
								name: 'enter',
								move: {
									slot: 'story01_grid-01_s01',
								},
								classStyle: {
									fontSize: 64,
									backgroundColor: '#ffff00',
									position: 'absolute',
								},
								style: {
									scale: 0.5,
								},
							},
							{
								name: 'step01',
								content: 'story01',
								move: {
									slot: 'story01_grid-01_s02',
									rescale: true,
								},
								transition: {
									to: {
										x: 100,
										y: 100,
										rotate: 200,
										scale: 0.4,
										fontSize: 100,
										backgroundColor: '#00ffff',
										color: '#0033FF',
									},
									duration: 2000,
								},
							},
							{
								name: 'step02',
								move: {
									slot: 'story01_grid-01_s03',
									rescale: true,
								},
								transition: {
									to: {
										scale: 1.5,
										rotate: 40,
										fontSize: 150,
										backgroundColor: '#00ff00',
										color: '#3300FF',
									},
									duration: 1000,
								},
								content: 'story01_text-sample',
							},
						],
					},
					{
						nature: 'img',
						id: 'story02_image',
						initial: {
							content: './ikono/vignette.jpg',
							fit: 'cover',
							classStyle: {
								position: 'absolute',
							},
							dimensions: {
								width: '100%',
								height: '100%',
							},
						},
						emit: {
							click: [
								{
									event: {
										channel: 'TC',
										name: 'pause',
									},
								},
							],
						},
						listen: [
							{
								event: 'go',
								action: 'enter',
							},
							{
								event: 'ev012',
								action: 'step01',
							},
							{
								event: 'ev014',
								action: 'step02',
							},
							{
								event: 'end-rescale-image',
								action: 'end-rescale-image',
							},
						],
						actions: [
							{
								name: 'end-rescale-image',
								style: {
									outline: '20px solid red',
								},
							},
							{
								name: 'enter',
								move: {
									slot: 'story01_grid-01_s03',
								},
								transition: {
									to: 'fadeIn',
								},
							},
							{
								name: 'step01',
								move: {
									slot: 'story01_fond_s01',
									rescale: true,
								},
								transition: {
									to: {
										opacity: 0.5,
									},
								},
							},
							{
								name: 'step02',
								move: {
									slot: 'story01_grid-01_s02',
									rescale: true,
								},
								transition: {
									to: {
										opacity: 1,
									},
								},
							},
						],
					},
					{
						nature: 'img',
						id: 'story02_image2',
						initial: {
							content: './ikono/perfume_002.jpg',
							fit: 'cover',
							classStyle: {
								position: 'absolute',
							},
						},
						listen: [
							{
								event: 'go',
								action: 'enter',
							},
							{
								event: 'ev011',
								action: 'step01',
							},
							{
								event: 'ev013',
								action: 'step02',
							},
							{
								event: 'end-rescale-image2',
								action: 'end-rescale-image2',
							},
						],
						actions: [
							{
								name: 'end-rescale-image2',
								style: {
									outline: '20px solid blue',
								},
							},
							{
								name: 'enter',
								move: {
									slot: 'story01_grid-01_s02',
								},
							},
							{
								name: 'step01',
								move: {
									slot: 'story01_grid-01_s01',
									rescale: true,
								},
								transition: {
									to: {
										opacity: 0.5,
									},
								},
							},
							{
								name: 'step02',
								move: {
									slot: 'story01_fond_s01',
									rescale: true,
								},
								transition: {
									to: {
										opacity: 1,
									},
								},
							},
						],
					},
					{
						nature: 'button',
						id: 'story02_togglePlay',
						initial: {
							classStyle: {
								color: 'white',
								backgroundColor: 'green',
								borderRadius: '4px',
								fontWeight: 'bold',
								fontSize: '12px',
								padding: '1rem',
								textTransform: 'uppercase',
								textAlign: 'center',
								transition: 'color 0.3s',
								'&:hover': {
									color: 'cyan',
								},
							},
							content: 'pause',
						},
						listen: [
							{
								event: 'go',
								action: 'enter',
							},
							{
								channel: 'telco',
								event: 'play',
								action: 'play',
							},
							{
								channel: 'telco',
								event: 'pause',
								action: 'pause',
							},
						],
						actions: [
							{
								name: 'enter',
								move: {
									slot: 'story01_grid-01_s05',
								},
							},
							{
								name: 'play',
								content: 'pause',
							},
							{
								name: 'pause',
								content: 'play',
							},
						],
						emit: {
							click: {
								event: {
									channel: 'strap',
									name: 'toggle',
								},
								data: {
									id: 'telco',
									event: {
										channel: 'telco',
										name: ['pause', 'play'],
									},
								},
							},
						},
					},
					{
						nature: 'sprite',
						id: 'story02_sprite',
						initial: {
							content: './ikono/Mystery-80.png',
							dimensions: {
								height: 300,
							},
							classStyle: {
								opacity: 0,
							},
						},
						listen: [
							{
								event: 'ev011',
								action: 'enter',
							},
							{
								event: 'ev013',
								action: 'step01',
							},
							{
								event: 'ev015',
								action: 'exit',
							},
							{
								channel: 'main',
								event: 'move-sprite',
								action: 'idle',
							},
							{
								event: 'leave-sprite',
								action: 'leave',
							},
						],
						actions: [
							{
								name: 'enter',
								move: {
									slot: 'story01_grid-01_s03',
								},
								transition: {
									to: {
										opacity: 1,
										x: -100,
										y: 10,
									},
								},
							},
							{
								name: 'step01',
								move: {
									slot: 'story01_grid-01_s01',
								},
								transition: {
									to: {
										x: 100,
										y: 50,
										rotate: 15,
									},
								},
							},
							{
								name: 'exit',
								exit: true,
								transition: {
									to: 'fadeOut',
								},
							},
							{
								name: 'leave',
								leave: true,
							},
							{
								name: 'idle',
							},
						],
						emit: {
							mousedown: {
								event: {
									channel: 'strap',
									name: 'move',
								},
								data: {
									id: 'sprite',
									event: 'move-sprite',
								},
							},
						},
					},
				],
				root: 'main',
			},
		],
	},
];
