// /** * IMPORTS FROM imports-loader ***/
// ;(function() {
//   /**
//    * D3 Docs: https://github.com/d3/d3/blob/master/API.md
//    * This file contains a Pedigree class to render a d3 tree pedigree.
//    * There are 2 d3 trees rendered, one for ancestors and one for descandants,
//    * they both are updated separately.
//    */

//   ;(() => {
//     const _cache = {
//       state: FS.cache.instance({ storeName: 'pedigrees' }),
//       zoom: FS.cache.instance({ storeName: 'pedigreeZoom' }),
//       positions: FS.cache.instance({
//         storeName: 'pedigreePositionsLandscape',
//         type: 'session'
//       })
//     }

//     /** Class representing a pedigree. */
//     window.Pedigree = class Pedigree {
//       /**
//        * @description - Create a pedigree.
//        * @param {object} el - DOM container element for pedigree nodes to be rendered
//        * @param {object} svgEl - DOM container element for pedigree lines to be renderered
//        * @param {object} config - redux pedigree state config
//        */
//       constructor(el, svgEl, config) {
//         const nodeConfig = config[config.orientation]

//         this.zoom = d3
//           .zoom()
//           .scaleExtent([0.05, 2])
//           .on('start', this._zoomStart.bind(this))
//           .on('end', this._zoomEnd.bind(this))
//           .on('zoom', () => {
//             const event = d3.event
//             throttle(this._zoomed.bind(this), 160, this)(event)
//           })

//         this.pedigreeEl = d3
//           .select(el)
//           .on('mousedown', (_) => {
//             const stack = FS.dialog.service.getStack()
//             const path = d3.event.composedPath()
//             const lastPath = path[path.length - 1]
//             let targetInDialog = false
//             stack.some((dialog) => {
//               return (targetInDialog = path.some((target) => {
//                 // eslint-disable-line no-return-assign
//                 return target === lastPath ? false : dialog.contains(target)
//               }))
//             })

//             if (stack.length && !targetInDialog) {
//               d3.event && d3.event.preventDefault()
//             }
//           })
//           .on(
//             'click',
//             (_) => {
//               const stack = FS.dialog.service.getStack()
//               const path = d3.event.composedPath()
//               const lastPath = path[path.length - 1]
//               let doNotCloseDialogs = false
//               let targetIndex = 0
//               let targetInDialog = false
//               if (stack.length > 0) {
//                 stack.forEach((dialog, index) => {
//                   d3.event.attachedToElementClicked = path.some((target) => {
//                     return target === lastPath
//                       ? false
//                       : dialog.attachToElement.contains(target)
//                   })
//                   targetInDialog = path.some((target) => {
//                     return target === lastPath ? false : dialog.contains(target)
//                   })
//                   if (targetInDialog) {
//                     doNotCloseDialogs = true
//                     targetIndex = index
//                   }
//                 })
//                 if (doNotCloseDialogs) {
//                   const dialogsToClose = stack.splice(
//                     targetIndex + 1,
//                     stack.length
//                   )
//                   dialogsToClose.forEach((dialog) => dialog.close())
//                 } else {
//                   FS.dialog.service.closeAllDialogs()
//                 }
//               }
//             },
//             true
//           )
//           .call(this.zoom)

//         this.container = this.pedigreeEl.select('.pedigree-container')
//         this.slowContainer = this.pedigreeEl.select('.pedigree-container.slow')

//         this.svgPedigreeEl = d3.select(svgEl)
//         this.svgContainer = this.svgPedigreeEl.select('g')

//         this.tree = d3.tree()
//         this.descTree = d3.tree()

//         this.tree.nodeSize([nodeConfig.nodeHeight + 10, nodeConfig.nodeWidth])
//         this.descTree.nodeSize([
//           nodeConfig.nodeHeight + nodeConfig.descVerticalMargin,
//           nodeConfig.nodeWidth
//         ])

//         /**
//          * Key handlers are added here to keep a single reference bound to `this`, and be able to unbind, later.
//          * https://stackoverflow.com/questions/33859113/javascript-removeeventlistener-not-working-inside-a-class/33859264#33859264
//          * TW-28 - Shift key causing browser to freeze
//          */
//         this._keydownHandler = this._handleKeyDown.bind(this)
//         this._keyupHandler = this._handleKeyUp.bind(this)
//         this._loseFocusHandler = this._resetZoomListener.bind(this)

//         window.addEventListener('blur', this._loseFocusHandler)
//       }

//       /**
//        * @description - Keydown handler
//        * @param {Event} event - document keydown event
//        */
//       _handleKeyDown(event) {
//         const keyCode = event.keyCode
//         const shiftKey = event.shiftKey
//         const rootTarget =
//           (event.composedPath && event.composedPath()[0]) ||
//           document.activeElement
//         if (keyCode === 187) {
//           this.zoomButtonHandler('in', rootTarget)
//         }
//         if (keyCode === 189) {
//           this.zoomButtonHandler('out', rootTarget)
//         }
//         if (shiftKey) {
//           this.pedigreeEl.on('wheel.zoom', null)
//           this.pedigreeEl.call(this.zoom)
//         }
//       }

//       /**
//        * @description - Keyup handler
//        * @param {Event} event - document keyup event
//        */
//       _handleKeyUp({ keyCode }) {
//         if (keyCode === 16) {
//           this.setUpEventListeners()
//         }
//       }

//       /**
//        * @description - Removes the wheel.zoom override in case shift is held while the page loses focus.
//        * TW-358 - ctrl+shift+tabbing away from pedigree and returning results in scroll zooming until shift is pressed again.
//        */
//       _resetZoomListener() {
//         this.pedigreeEl.on('wheel.zoom', this.wheeled.bind(this))
//       }

//       /**
//        * @description - Returns the current zoom
//        */
//       getZoom() {
//         return _cache.zoom.getItem('zoom')
//       }

//       /**
//        * @description - sets up document keydown/up listeners as well as scroll panning/zooming
//        */
//       setUpEventListeners() {
//         this.removeEventListeners()
//         document.body.addEventListener('keydown', this._keydownHandler)
//         document.body.addEventListener('keyup', this._keyupHandler)

//         const config = __state__.getState().pedigree.config
//         if (!config.zoom) {
//           this.pedigreeEl.on('wheel.zoom', this.wheeled.bind(this))
//         }
//       }

//       /**
//        * @description - removes document keydown/up listeners
//        */
//       removeEventListeners() {
//         this.pedigreeEl.on('wheel.zoom', null)
//         this.pedigreeEl.call(this.zoom)
//         document.body.removeEventListener('keydown', this._keydownHandler)
//         document.body.removeEventListener('keyup', this._keyupHandler)
//       }

//       clearPedigree() {
//         this.container.node().innerHTML = ''
//         this.svgContainer.node().innerHTML = ''
//         this.slowContainer.node().innerHTML = ''
//       }

//       /**
//        * @description - This handles scrolling for zooming and mouse moves for panning.
//        * It also fires a click event if the view didn't pan.
//        * @param {Event} event - d3 zoom/pan event
//        */
//       _zoomed(event) {
//         if (
//           this.slowDevice &&
//           this.slowContainer.node().hasAttribute('hidden')
//         ) {
//           this.slowContainer.attr('hidden', null)
//           this.container.attr('hidden', '')
//         }

//         const srcEvent = event.sourceEvent

//         event.transform = this._constrainZoomPan(event.transform)

//         // allow vertical scrolling of scrollable children nodes
//         if (srcEvent && srcEvent.composedPath) {
//           const el = this.getScrollableElement(srcEvent.composedPath())
//           if (el && srcEvent.type === 'touchmove') {
//             const dy =
//               this.start.y -
//               (srcEvent.y === undefined ? srcEvent.pageY : srcEvent.y)
//             let scrollTop = el.scrollTop + dy
//             if (scrollTop < 0) {
//               scrollTop = 0
//             }
//             el.scrollTop = scrollTop
//             return
//           }
//         }

//         if (
//           Number.isNaN(event.transform.k) ||
//           Number.isNaN(event.transform.x) ||
//           Number.isNaN(event.transform.y)
//         ) {
//           event.transform.k = event.transform.x = event.transform.y = 1

//           return
//         }

//         if (this.slowDevice) {
//           this.slowContainer.attr(
//             'style',
//             `transform: translate(${event.transform.x}px, ${event.transform.y}px) scale(${event.transform.k})`
//           )
//         } else {
//           this.container.attr(
//             'style',
//             `transform: translate(${event.transform.x}px, ${event.transform.y}px) scale(${event.transform.k})`
//           )
//         }

//         this.svgContainer.attr('transform', event.transform)

//         saveTransform(d3.event.transform)
//       }

//       /**
//        * @description - Event handler when zoom starts. Used to record mouse beginning position.
//        */
//       _zoomStart() {
//         // record x and y values at beginning of zoom
//         const srcEvent = d3.event.sourceEvent
//         if (srcEvent) {
//           this.pedigreeEl.node().dispatchEvent(
//             new Event('pedigree-zoom-start', {
//               bubbles: true,
//               composed: true
//             })
//           )

//           // close #popover dialogs if open
//           // This event is firing on almost all clicks/drags on the entire
//           // pedigree - I don't think that's correct behavior For now though,
//           // to fix bugs with dialogs closing when we don't expect, I'm just
//           // removing the popover close function. It seems wrong.
//           // document.querySelector("#popover").close();
//           this.start = {
//             x: srcEvent.x === undefined ? srcEvent.pageX : srcEvent.x,
//             y: srcEvent.y === undefined ? srcEvent.pageY : srcEvent.y
//           }
//         }
//       }

//       /**
//        * @description - Event handler when zoom ends. Used to measure mouse movement and dispatch click event if mouse hasn't reached threshold
//        * @returns {undefined} - Sets attributes directly.
//        */
//       _zoomEnd() {
//         const event = d3.event
//         const srcEvent = event.sourceEvent
//         const mouseMoveThreshold = 5

//         if (srcEvent && this.start) {
//           // record distance moved horizontally and vertically
//           const distance = {
//             x: Math.abs(
//               this.start.x -
//                 (srcEvent.x === undefined ? srcEvent.pageX : srcEvent.x)
//             ),
//             y: Math.abs(
//               this.start.y -
//                 (srcEvent.y === undefined ? srcEvent.pageY : srcEvent.y)
//             )
//           }

//           // if distance moved is greater than 0 and less than 5, create and dispatch click event
//           if (
//             (distance.x > 0 && distance.x < mouseMoveThreshold) ||
//             (distance.y > 0 && distance.y < mouseMoveThreshold)
//           ) {
//             // Create new click event
//             const clickEvent = srcEvent.srcElement.ownerDocument.createEvent(
//               'MouseEvents'
//             )
//             // Pass the event options like pageX and pageY from the source event to the new one
//             clickEvent.initMouseEvent(
//               'click',
//               true,
//               true,
//               window,
//               null,
//               srcEvent.screenX,
//               srcEvent.screenY,
//               srcEvent.pageX,
//               srcEvent.pageY
//             )
//             // Dispatch the click event
//             setTimeout(() => {
//               srcEvent.srcElement.dispatchEvent(clickEvent)
//             })
//           }
//         }
//         if (this.slowDevice) {
//           this.slowContainer.attr('hidden', '')
//           this.container.attr('hidden', null)
//           this.container.attr(
//             'style',
//             `transform: translate(${event.transform.x}px, ${event.transform.y}px) scale(${event.transform.k})`
//           )
//         }
//       }

//       getScrollableElement(path) {
//         let scrollableEl

//         if (path) {
//           let el = path[0]
//           let index = 0
//           const pedigreeElement = this.pedigreeEl._groups[0][0]
//           while (
//             !scrollableEl &&
//             el &&
//             el !== pedigreeElement &&
//             index < path.length - 1
//           ) {
//             if (el.scrollHeight > el.clientHeight) {
//               const overflowY = window.getComputedStyle(el).overflowY
//               if (overflowY === 'auto' || overflowY === 'scroll') {
//                 scrollableEl = el
//               }
//             }
//             index++
//             el = path[index]
//           }
//         }
//         return scrollableEl
//       }

//       /**
//        * @description - This handles scrolling for panning
//        */
//       wheeled() {
//         const event = d3.event
//         const dy = Math.abs(event.deltaY)
//         const path = d3.event.composedPath()
//         let t = d3.zoomTransform(this.pedigreeEl.node())

//         // allow vertical scrolling of scrollable children nodes
//         if (path && dy) {
//           let scrollableElementFound = false
//           let el = path[0]
//           let index = 0
//           const pedigreeElement = this.pedigreeEl._groups[0][0]
//           while (el && el !== pedigreeElement && index < path.length - 1) {
//             if (el.scrollHeight > el.clientHeight) {
//               const overflowY = window.getComputedStyle(el).overflowY
//               if (overflowY === 'auto' || overflowY === 'scroll') {
//                 scrollableElementFound = true
//                 return
//               }
//             }
//             index++
//             el = path[index]
//           }
//           if (!scrollableElementFound) {
//             event.preventDefault && event.preventDefault()
//           }
//         }

//         if (
//           this.slowDevice &&
//           this.slowContainer.node().hasAttribute('hidden')
//         ) {
//           this.slowContainer.attr('hidden', null)
//           this.container.attr('hidden', '')
//         }

//         t.x -= event.deltaX

//         // Taken from d3: https://github.com/d3/d3-zoom/blob/master/src/zoom.js#L34
//         // This is for firefox.
//         t.y -= event.deltaY * (event.deltaMode ? 120 : 1)

//         t = this._constrainZoomPan(t)

//         if (Number.isNaN(t.k) || Number.isNaN(t.x) || Number.isNaN(t.y)) {
//           t.k = t.x = t.y = 1

//           return
//         }

//         if (this.slowDevice) {
//           this.slowContainer.attr(
//             'style',
//             `transform: translate(${t.x}px, ${t.y}px) scale(${t.k})`
//           )
//           updateNodesPosition(this.container, this.slowContainer, t)
//         } else {
//           this.container.attr(
//             'style',
//             `transform: translate(${t.x}px, ${t.y}px) scale(${t.k})`
//           )
//         }

//         this.svgContainer.attr('transform', t)

//         saveTransform(t)
//       }

//       _constrainZoomPan(t) {
//         const windowWidth = window.innerWidth
//         const windowHeight = window.innerHeight

//         if (t.x > Math.abs(this.left * t.k) + windowWidth - 100 * t.k) {
//           t.x = Math.abs(this.left * t.k) + windowWidth - 100 * t.k
//         }
//         if (t.x < -this.right * t.k - 200 * t.k) {
//           t.x = -this.right * t.k - 200 * t.k
//         }
//         if (t.y > Math.abs(this.top * t.k) + windowHeight * 0.875) {
//           t.y = Math.abs(this.top * t.k) + windowHeight * 0.875
//         }
//         if (t.y < -this.bottom * t.k + windowHeight / 8) {
//           t.y = -this.bottom * t.k + windowHeight / 8
//         }
//         return t
//       }

//       /**
//        * @description - Zoom button handler
//        * @param {string} direction - `in` or `out`
//        */
//       zoomButtonHandler(direction, target) {
//         if (
//           (target && target.tagName.toLowerCase() === 'textarea') ||
//           (target && target.type === 'text')
//         ) {
//           return
//         }
//         let zoom
//         if (direction === 'in') {
//           zoom = 1.5
//         }
//         if (direction === 'out') {
//           zoom = 0.66666666666
//         }

//         this.pedigreeEl
//           .transition()
//           .duration(200)
//           .call(this.zoom.scaleBy, zoom)
//       }

//       /**
//        * @description - Read zoom/pan state saved in cache and set zoom/pan to that point.
//        * @param  {string} pid - Person id of the person of focus.
//        * @param  {boolean} reset - Whether to reset the zoom.
//        */
//       centerInit(pid, reset, recenterAndCollapse) {
//         const state = __state__.getState()
//         const svgContainer = this.pedigreeEl
//           .select('.pedigree-container')
//           .node()

//         // OFT-69176 - Force initial load of pedigree to be completely in view
//         const pedigreeStyle = svgContainer && svgContainer.getAttribute('style')
//         // Don't do initial centering if pedigree is already positioned (avoids 2x reposition when changing generations)
//         if (!pedigreeStyle || !pedigreeStyle.includes('translate')) {
//           this.pedigreeEl.call(this.zoom.transform, () => {
//             const state = __state__.getState()
//             const position =
//               state.prefs.gens === 2
//                 ? { x: 195, y: 200, k: 0.44 }
//                 : { x: 75, y: 300, k: 0.4 }
//             return d3.zoomIdentity
//               .translate(position.x, position.y)
//               .scale(position.k)
//           })
//         }
//         if (reset) {
//           return this.recenter(state)
//         }
//         // The user's zoom state should remain the same from pid to pid.
//         // The transform (x,y) is saved/retreived per pid.
//         return Promise.all([
//           _cache.positions.getItem(
//             `${pid}_${state.pedigree.config.orientation}`
//           ),

//           _cache.zoom.getItem('zoom')
//         ])
//           .then(([transform, zoom = 1]) => {
//             if (zoom === null) zoom = 1
//             const state = __state__.getState()
//             if (!transform || Number.isNaN(zoom) || recenterAndCollapse) {
//               this.recenter(state, zoom)
//               return
//             }

//             // TODO: Possibly revisit only rendering 1 pedigree block if device is slow. The issue right now is
//             // that the function run to tell if a device is slow is `updateData` and it runs after this function.

//             // if (!state.slowDevice) {
//             //   return
//             // }

//             this.pedigreeEl
//               .transition()
//               .duration(200)
//               .call(this.zoom.transform, () => {
//                 return d3.zoomIdentity
//                   .translate(transform.x, transform.y)
//                   .scale(zoom)
//               })
//           })
//           .catch((err) => {
//             // eslint-disable-line handle-callback-err
//             this.recenter(state)
//           })
//       }

//       /**
//        * @description - Recenter tree to person of focus pedigree block
//        * @param {object} state - redux state.
//        * @param {number} zoom - Current zoom for this user.
//        */
//       recenter(state, zoom) {
//         this.pedigreeEl
//           .transition()
//           .duration(300)
//           .call(this.zoom.transform, () => {
//             const orientationConfig =
//               state.pedigree.config[state.pedigree.config.orientation]
//             const nodeColumns = state.prefs.gens + 1 // add one for descendants
//             const header = document.querySelector('#global-header')
//             const headerHeight = (header && header.offsetHeight + 35) || 35 // header height plus pedigree nav (not queryable in shadow dom)
//             const rootNodeWidth = 250 // since the 1st gen after the root x value is less than the nodeWidth, we define that here
//             const nodeHeight =
//               orientationConfig.nodeHeight + orientationConfig.verticalMargin
//             const nodeWidth =
//               orientationConfig.nodeWidth + orientationConfig.horizontalMargin
//             const halfNodeWidth = nodeWidth / 2
//             const containerHeight =
//               this.pedigreeEl.node().offsetHeight + headerHeight
//             const containerWidth = this.pedigreeEl.node().offsetWidth
//             const treeWidthWithDesc = nodeColumns * nodeWidth + rootNodeWidth
//             const treeBlockWidth = (nodeColumns - 1) * nodeWidth + rootNodeWidth
//             let scale = zoom || 1
//             let x
//             let y

//             if (state.pedigree.config.orientation === 'portrait') {
//               y = containerHeight / 2 - (nodeHeight / 2) * scale
//               x = containerWidth / 2
//             } else {
//               if (
//                 containerWidth >
//                 treeWidthWithDesc + orientationConfig.horizontalMargin
//               ) {
//                 // render whole pedigree centered
//                 x = (containerWidth - treeWidthWithDesc) / 2 + nodeWidth
//               } else if (
//                 containerWidth <
//                 treeBlockWidth +
//                   orientationConfig.horizontalMargin +
//                   halfNodeWidth
//               ) {
//                 // render just pedigree block left aligned
//                 x = orientationConfig.horizontalMargin + halfNodeWidth
//               } else {
//                 // render just pedigree block so that the expand buttons are visible
//                 x =
//                   containerWidth -
//                   treeBlockWidth -
//                   orientationConfig.horizontalMargin
//               }

//               // if mobile, scale so pedigree block can fit in width of window
//               if (containerWidth < 760) {
//                 // if zoom is null, it means the user has not zoomed yet, we only want
//                 // to change the scale if the user hasn't zoomed yet.
//                 if (!zoom) {
//                   scale = containerWidth / (treeBlockWidth + rootNodeWidth)
//                 }
//                 x = halfNodeWidth * scale
//               }

//               y = containerHeight / 2 - (nodeHeight / 2) * scale
//             }

//             return d3.zoomIdentity.translate(x, y).scale(scale)
//           })
//       }

//       /**
//        * @description - Renders desc pedigree
//        * @param {object} root - Pedigree data in d3 tree format
//        * @param {object} state - redux state
//        * @param {boolean} lls - whether lls is using this (hides some html and functionality)
//        */
//       updateDescData(root, state, lls = false) {
//         if (!root.eachBefore) return
//         const config = state.pedigree.config
//         const nodeConfig = config[config.orientation]

//         this.descTree.nodeSize([
//           nodeConfig.nodeHeight + nodeConfig.descVerticalMargin,
//           nodeConfig.nodeWidth
//         ])

//         // rerender descending tree
//         this.descTree(root)

//         /**
//          * @description - Compute y position for desc nodes
//          * @param {object} children - d3 tree node children object
//          */
//         function getYPosition(depth, children) {
//           const nodeWidth = nodeConfig.nodeWidth
//           const hMargin = nodeConfig.descHorizontalMargin
//           let fullWidth
//           if (depth === 0) {
//             fullWidth =
//               (children.length - 1) * nodeWidth +
//               (children.length - 2) * hMargin
//           } else {
//             fullWidth =
//               children.length * nodeWidth + (children.length - 1) * hMargin
//           }
//           children.forEach((c, i) => {
//             const commonOffset =
//               -(fullWidth / 2) + (nodeWidth + hMargin) * i + nodeWidth / 2
//             if (depth === 0) {
//               c.y = commonOffset
//             } else {
//               c.y = c.parent.y + commonOffset
//             }

//             if (c.children && c.children.length) {
//               getYPosition(depth, c.children)
//             }
//           })
//         }

//         root.descendants().forEach((d) => {
//           // set desc coupleAhnentafel
//           if (d.depth && d.data.coupleNumber) {
//             d.coupleAhnentafel =
//               d.depth === 1
//                 ? `${d.depth}.${d.data.coupleNumber}`
//                 : `${d.parent.coupleAhnentafel}.${d.data.coupleNumber}`
//           }

//           if (config.orientation === 'portrait') {
//             if (d.depth > 0) {
//               d.x =
//                 (nodeConfig.nodeHeight +
//                   nodeConfig.descVerticalMargin +
//                   nodeConfig.expanderSize) *
//                 d.depth
//             }
//             if (d && d.children && d.children.length) {
//               getYPosition(d.depth, d.children)
//             }
//           } else {
//             // Landscape
//             const arrowMargin = 60
//             const nodeWidth = nodeConfig.nodeWidth
//             const firstPosition =
//               -(nodeWidth * d.depth) - nodeConfig.horizontalMargin
//             const nthPosition =
//               -(nodeWidth * d.depth) -
//               arrowMargin * d.depth -
//               nodeConfig.horizontalMargin * d.depth +
//               nodeConfig.expanderSize

//             if (d.depth === 0) {
//               d.y = 0
//             } else if (d.depth === 1) {
//               d.y = firstPosition
//             } else {
//               d.y = nthPosition
//             }
//           }
//         })

//         /**
//          * @description - Draw desc line links between nodes
//          * @param {object} d - d3 tree node object
//          */
//         function descLinkLine(d) {
//           if (config.orientation === 'portrait') {
//             let fromX = d.y // horizontal center of desc node
//             const fromY = d.x // top of desc node
//             const toX = d.parent.y // horizontal center of parent couple node
//             const toY = d.parent.x + nodeConfig.nodeHeight // bottom of parent node

//             // Line up horizontally with direct descendant
//             if (d.data.descendant === 'person1') {
//               fromX -= nodeConfig.nodeWidth / 4
//             }
//             if (d.data.descendant === 'person2') {
//               fromX += nodeConfig.nodeWidth / 4
//             }

//             // M[Pen-down at x y] V[Draw vertical line to y] H[Draw horizontal line to x]
//             return `M${fromX} ${fromY} V${fromY -
//               nodeConfig.verticalNodeTranslation} H${toX} V${toY}`
//           } else {
//             // landscape
//             const horizontalNodeTranslation =
//               nodeConfig.horizontalNodeTranslation
//             let x = d.x + nodeConfig.nodeHeight / 2
//             let y = d.y - nodeConfig.nodeWidth + horizontalNodeTranslation
//             const parentX = d.parent.x + nodeConfig.nodeHeight / 2
//             let parentY =
//               d.parent.y - nodeConfig.nodeWidth + horizontalNodeTranslation

//             y += nodeConfig.nodeWidth
//             parentY += nodeConfig.nodeWidth

//             // Line up with direct descendant
//             if (d.data.descendant === 'person1') {
//               x -= nodeConfig.nodeHeight / 4
//             }
//             if (d.data.descendant === 'person2') {
//               x += nodeConfig.nodeHeight / 4
//             }

//             if (d.depth === 1) {
//               return `M${y +
//                 nodeConfig.nodeWidth -
//                 horizontalNodeTranslation} ${x} H${parentY -
//                 nodeConfig.horizontalMargin} V${parentX} H${parentY -
//                 horizontalNodeTranslation}`
//             } else {
//               return `M${y +
//                 nodeConfig.nodeWidth -
//                 horizontalNodeTranslation} ${x} H${parentY -
//                 nodeConfig.horizontalMargin * 2 -
//                 10} V${parentX} H${parentY - horizontalNodeTranslation}`
//             }
//           }
//         }

//         const links = this.svgContainer
//           .selectAll('.desc-link')
//           .data(root.descendants().slice(1))

//         links
//           .style('opacity', 0)
//           .attr('d', descLinkLine)
//           .transition()
//           .duration(500)
//           .style('opacity', 1)

//         links
//           .enter()
//           .append('path')
//           .attr('class', 'desc-link')
//           .attr('d', descLinkLine)

//         links.exit().remove()

//         /**
//          * @description - Define properties on pedigree-couple-renderer
//          * @param {object} d - d3 tree node object
//          * @this pedigree-couple-renderer dom node
//          */
//         function addDescCoupleRendererProps(d) {
//           if (this.hasAttribute('slow')) {
//             this.innerHTML = ''
//             return
//           }
//           if (d.depth === 0) {
//             this.hidden = true
//             this.appendable = false
//           } else {
//             this.hidden = false
//             this.appendable = true
//           }
//           this.halfSize = false
//           this.couple = d.data
//           this.coupleId = d.data.id
//           this.depth = d.depth
//           this.coupleAhnentafel = d.coupleAhnentafel

//           if (d.parent) {
//             this.parentsCouple = {
//               person1: d.parent.data && d.parent.data.person1,
//               person2: d.parent.data && d.parent.data.person2
//             }
//           }

//           // sanitize all names
//           this.couple.person1.sanitizedName = FS.htmlEncode(
//             this.couple.person1.name
//           )
//           this.couple.person2.sanitizedName = FS.htmlEncode(
//             this.couple.person2.name
//           )

//           if (this.parentsCouple) {
//             if (this.parentsCouple.person1) {
//               this.parentsCouple.person1.sanitizedName = FS.htmlEncode(
//                 this.parentsCouple.person1.name
//               )
//             }
//             if (this.parentsCouple.person2) {
//               this.parentsCouple.person2.sanitizedName = FS.htmlEncode(
//                 this.parentsCouple.person2.name
//               )
//             }
//           }

//           this.hasChildrenNodes = !!d.children
//           this.pedigreeType = 'children'
//           this.coords = { x: d.y, y: d.x }
//           setTimeout((_) => {
//             this.loadingPedigree = d.loadingPed
//           }, 100)
//         }

//         /**
//          * @description - Define attributes on pedigree-couple-renderer
//          * @param {object} d - d3 tree node object
//          */
//         function descAttrs(node) {
//           if (lls) node.attr('lls', lls) // chaining this attr on `node` with other attrs doesn't set it as expected, so it needs to be set this way. Possibly because it's a boolean value.
//           node
//             .attr('class', 'desc-node')
//             .attr('tabindex', '-1')
//             .attr('style', (d) => {
//               let width = nodeConfig.nodeWidth
//               let height = nodeConfig.nodeHeight
//               const halfWidth = nodeConfig.nodeHalfWidth
//               const halfHeight = nodeConfig.nodeHalfHeight
//               const orientationConfig = config.orientation
//               let x = d.x
//               let y =
//                 orientationConfig === 'portrait'
//                   ? d.y - config.portrait.nodeWidth / 2
//                   : d.y

//               if (d.data.childPlaceholder) {
//                 if (orientationConfig === 'portrait') {
//                   y = y + (width - halfWidth) / 2
//                   width = halfWidth
//                 } else {
//                   x = x + (height - halfHeight) / 2
//                   height = halfHeight
//                 }
//               }
//               let styles = `width: ${width}px;
//                                 height: ${height}px;
//                                 position: absolute;
//                                 left: ${y}px;
//                                 top: ${x}px;
//                                 `
//               if (d.depth === 0) {
//                 styles += 'display: none;'
//               }
//               return styles
//             })
//             .attr('data-test-couple-ahnentafel', (d) => d.coupleAhnentafel)
//             .attr('child-placeholder', (d) =>
//               d.data.childPlaceholder ? '' : null
//             )
//             .attr('data-test-child-placeholder', (d) =>
//               d.data.childPlaceholder ? '' : null
//             )
//         }
//         const node = this.container
//           .selectAll('pedigree-couple-renderer.desc-node')
//           .data(root.descendants(), (d) => d.id)

//         node
//           .transition()
//           .duration(500)
//           .call(descAttrs.bind(this))
//           .each(addDescCoupleRendererProps)

//         node
//           .enter()
//           .append('pedigree-couple-renderer')
//           .call(descAttrs.bind(this))
//           .each(addDescCoupleRendererProps)

//         node.exit().remove()

//         const nodeSlow = this.slowContainer
//           .selectAll('pedigree-couple-renderer.desc-node')
//           .data(root.descendants(), (d) => d.id)

//         nodeSlow.call(descAttrs.bind(this)).each(addDescCoupleRendererProps)

//         nodeSlow
//           .enter()
//           .append('pedigree-couple-renderer')
//           .attr('slow', '')
//           .call(descAttrs.bind(this))
//           .each(addDescCoupleRendererProps)

//         nodeSlow.exit().remove()
//       }

//       /**
//        * @description - Renders pedigree
//        * @param {object} root - Pedigree data in d3 tree format
//        * @param {object} state - redux state
//        * @param {boolean} lls - whether we're in lls-mode
//        */
//       updateData(root, state, lls = false) {
//         if (!root.eachBefore) return
//         if (
//           !PerfHelpers.getUserTime('V8:pedigree:pedigree-render:init').length
//         ) {
//           PerfHelpers.markUserTime('V8:pedigree:pedigree-render:init')
//         }

//         const centerId =
//           state.pedigree.pedigreeRootPids[
//             Object.keys(state.pedigree.pedigreeRootPids).length - 1
//           ]
//         const centerAhnentafels = state.pedigree.centerAhnentafels
//         const config = state.pedigree.config
//         const nodeConfig = config[config.orientation]

//         this.tree.nodeSize([nodeConfig.nodeHeight + 10, nodeConfig.nodeWidth])

//         let centerAhnentafel = 1 // eslint-disable-line no-unused-vars

//         this.tree(root)

//         root.descendants().forEach((d, i) => {
//           if (i === 0) {
//             d.coupleAhnentafel = 1
//           }

//           if (d.children && d.children[0]) {
//             // TW-2589: Numbers greater than 590295810358705700000 (at least for me), which is at 70 generations, change to scientific notation.
//             // On landscape or portrait we never display more than one ancestral line and ahnentafels get big fast with large gaps in between.
//             // Once we get above a certain number we are just changing the decimal to use lower numbers for ahnentafels.
//             // This limit also ensures we don't make excessive calls to tree-data
//             // Currently we cap saved expansions functionality at 20 generations via this number
//             d.children[0].coupleAhnentafel =
//               d.coupleAhnentafel > 1050000
//                 ? d.coupleAhnentafel * 0.2
//                 : d.coupleAhnentafel * 2
//           }
//           if (d.children && d.children[1]) {
//             // TW-2589: Numbers greater than 590295810358705700000 (at least for me), which is at 70 generations, change to scientific notation.
//             // On landscape or portrait we never display more than one ancestral line and ahnentafels get big fast with large gaps in between.
//             // Once we get above a certain number we are just changing the decimal to use lower numbers for ahnentafels.
//             // This limit also ensures we don't make excessive calls to tree-data
//             // Currently we cap saved expansions functionality at 20 generations via this number
//             d.children[1].coupleAhnentafel =
//               d.coupleAhnentafel > 1050000
//                 ? d.coupleAhnentafel * 0.2 + 1
//                 : d.coupleAhnentafel * 2 + 1
//           }

//           d.coupleAhnentafel = d.coupleAhnentafel.toString()

//           if (d.id.includes(centerId)) {
//             centerAhnentafel = d.coupleAhnentafel
//           }
//         })

//         root.descendants().forEach((d, i) => {
//           const lastGenNumNodes = 2 ** state.prefs.gens
//           const nodeHeight = nodeConfig.nodeHeight + nodeConfig.verticalMargin
//           const nodeHalfHeight =
//             nodeConfig.nodeHalfHeight + nodeConfig.verticalMargin
//           const nodeWidth = nodeConfig.nodeWidth + nodeConfig.horizontalMargin
//           const nodeHalfWidth =
//             nodeConfig.nodeHalfWidth + nodeConfig.horizontalMargin

//           let height = lastGenNumNodes * nodeHeight
//           let width = lastGenNumNodes * nodeWidth

//           if (
//             state.prefs.gens === 4 ||
//             state.prefs.gens === 5 ||
//             state.prefs.gens === 6
//           ) {
//             height = lastGenNumNodes * nodeHalfHeight
//             width = lastGenNumNodes * nodeHalfWidth
//           }

//           /**
//            * @description - Computes the y value for each node
//            * @param {object} depths - definitions for y pos for each gen
//            * @param {number} relativeDepth - The relative depth for the generation block the node is in
//            * @param {number} expanderSize - Width (landscape) or Height (portrait) in config for the expander arrow
//            * @param {number} genBlock - zero based number defining generation block the node is in
//            */
//           function computeXBlockPos(
//             depths,
//             relativeDepth,
//             expanderSize,
//             genBlock
//           ) {
//             if (!relativeDepth) return 0

//             let y

//             /**
//              * calculate the width of an entire gen block
//              */
//             let block = depths.slice(2, depths.length).reduce((s, iterator) => {
//               return s + iterator
//             }, 0)
//             block += expanderSize

//             /**
//              * get an array of only the widths up to the node we are calculating
//              */
//             const nodePositionArray = depths.slice(0, relativeDepth + 1)

//             /**
//              * Add those widths up for node y
//              */
//             y = nodePositionArray.reduce((s, d) => {
//               return s + d
//             }, 0)

//             if (genBlock >= 1) {
//               /**
//                * Multiply that by the block number
//                */
//               return y + block * (genBlock - 1)
//             }
//             return y
//           }

//           /**
//            * @description - Compute x position
//            * @param {*} d
//            * @param {*} gens
//            * @param {*} config
//            */
//           function computeX(d, gens, config) {
//             const depth = d.depth

//             let theNodeWidth
//             if (config.orientation === 'portrait') {
//               theNodeWidth = nodeHeight
//             } else {
//               theNodeWidth = nodeWidth
//             }
//             const nodeWidth3rd = theNodeWidth / 3

//             /**
//              * Define y position for each generation block
//              */
//             const depths = {
//               gen1: [0, theNodeWidth, theNodeWidth],
//               gen2: [
//                 0, // person of focus is at 0
//                 theNodeWidth - nodeWidth3rd, // parents at 0+theNodeWidth-(theNodeWidth/3)
//                 theNodeWidth, // grandparents adds another theNodeWidth on top 0+(theNodeWidth-nodeWidth3rd)
//                 theNodeWidth // great grandparents adds another theNodeWidth on top 0+(theNodeWidth-nodeWidth3rd)+theNodeWidth
//               ],
//               gen3: [
//                 0,
//                 theNodeWidth - nodeWidth3rd,
//                 theNodeWidth,
//                 theNodeWidth,
//                 theNodeWidth
//               ],
//               gen4: [
//                 0,
//                 theNodeWidth - nodeWidth3rd - nodeWidth3rd,
//                 theNodeWidth - nodeWidth3rd - nodeWidth3rd,
//                 theNodeWidth,
//                 theNodeWidth,
//                 theNodeWidth
//               ],
//               gen5: [
//                 0,
//                 theNodeWidth - nodeWidth3rd - nodeWidth3rd,
//                 theNodeWidth - nodeWidth3rd - nodeWidth3rd,
//                 theNodeWidth - nodeWidth3rd,
//                 theNodeWidth,
//                 theNodeWidth,
//                 theNodeWidth
//               ],
//               gen6: [
//                 0,
//                 theNodeWidth - nodeWidth3rd - nodeWidth3rd,
//                 theNodeWidth - nodeWidth3rd - nodeWidth3rd,
//                 theNodeWidth - nodeWidth3rd,
//                 theNodeWidth,
//                 theNodeWidth,
//                 theNodeWidth,
//                 theNodeWidth
//               ]
//             }

//             let genBlock = depth / gens

//             if (!Number.isInteger(genBlock)) {
//               genBlock = parseInt(genBlock, 10) + 1
//             }

//             return computeXBlockPos(
//               depths[`gen${gens}`],
//               d.relativeDepth,
//               nodeConfig.expanderSize,
//               genBlock
//             )
//           }

//           /**
//            * @description - Compute y position
//            * @param {*} gens
//            * @param {*} coupleAhnentafel
//            * @param {*} depth
//            */
//           function computeYBlockPos(gens, coupleAhnentafel, depth) {
//             let position

//             // Number of coupleAhnentafel’s per generation.
//             const depthNodeCount = 2 ** depth

//             if (config.orientation === 'portrait') {
//               // Distance between each node
//               const depthHeight = width / (depthNodeCount * 2)

//               // Return position of each node.
//               position =
//                 -width / 2 +
//                 ((coupleAhnentafel - 2 ** depth) * 2 + 1) * depthHeight
//             } else {
//               // Landscape
//               // Distance between each node
//               const depthHeight = height / (depthNodeCount * 2)

//               // Return position of each node.
//               position =
//                 -height / 2 +
//                 ((coupleAhnentafel - 2 ** depth) * 2 + 1) * depthHeight
//               // move the last generation down 15 pixels to center all nodes between connecting lines.
//               // This is because of the children drop down button below the node.
//               if (depth === gens) {
//                 position += 15
//               }
//             }

//             return position
//           }

//           /**
//            * @description - Get relate y position
//            * @param {*} gens
//            * @param {*} coupleAhnentafel
//            * @param {*} depth
//            * @param {*} d
//            * @param {*} relativeAhnentafel
//            */
//           function getRelativeY(
//             gens,
//             coupleAhnentafel,
//             depth,
//             d,
//             relativeAhnentafel
//           ) {
//             // recursive function to find parent with center coupleAhnentafel (parent where pedigree is appended)
//             /**
//              * @description -
//              * @param {*} p
//              */
//             function findParentWithCenterAhnentafel(p) {
//               if (!p) return 0
//               if (centerAhnentafels.includes(p.coupleAhnentafel)) {
//                 if (config.orientation === 'portrait') {
//                   return p.y
//                 } else {
//                   // Landscape
//                   return p.x
//                 }
//               } else {
//                 return findParentWithCenterAhnentafel(p.parent)
//               }
//             }

//             if (centerAhnentafels.includes(coupleAhnentafel)) {
//               config.centerX = computeYBlockPos(
//                 gens,
//                 relativeAhnentafel,
//                 d.relativeDepth
//               )
//             }

//             const x = computeYBlockPos(
//               gens,
//               relativeAhnentafel,
//               d.relativeDepth
//             )

//             if (parseInt(coupleAhnentafel, 10) < 2 ** (gens + 1)) {
//               return x
//             } else {
//               return x + findParentWithCenterAhnentafel(d.parent)
//             }
//           }

//           if (config.orientation === 'portrait') {
//             d.y = getRelativeY(
//               state.prefs.gens,
//               d.coupleAhnentafel,
//               d.depth,
//               d,
//               d.data.relativeAhnentafel
//             )
//             d.x = -computeX(d, state.prefs.gens, config)
//           } else {
//             d.x = getRelativeY(
//               state.prefs.gens,
//               d.coupleAhnentafel,
//               d.depth,
//               d,
//               d.data.relativeAhnentafel
//             )
//             d.y = computeX(d, state.prefs.gens, config)
//           }
//         })

//         /**
//          * @description - Create connector lines
//          * @param {*} d
//          */
//         function linkLine(d) {
//           // OFT-69152: Don't compute lines for a hidden, placeholder couple block
//           if (d.id && d.id === 'UNKNOWN') return

//           if (config.orientation === 'portrait') {
//             const fromX = d.y // horizontal center of ancestor node
//             const fromY = d.x + nodeConfig.nodeHeight // bottom of the ancestor node
//             let toX = d.parent.y // horizontal center of descendant node
//             let toY = d.parent.x // top of descendant node
//             const paternalNode = toX > fromX // if line will go to the left side of the descendant node

//             if (d.relativeDepth === 1 && d.depth !== 1) {
//               return `M${fromX} ${fromY} V${fromY +
//                 nodeConfig.verticalNodeTranslation} H${toX} V${toY}`
//             }

//             if (d.depth === 1) {
//               toY = toY + 0.75 * nodeConfig.nodeHeight // connect 75% down the side of the descendant node
//             } else {
//               toY = toY + 0.25 * nodeConfig.nodeHeight // connect 25% down the side of the descendant node
//             }

//             if (paternalNode) {
//               toX = toX - nodeConfig.nodeWidth / 2 // left side of descendant node
//             } else {
//               toX = toX + nodeConfig.nodeWidth / 2 // right side of descendant node
//             }

//             return `M${fromX} ${fromY} V${toY} H${toX}`
//           } else {
//             const horizontalNodeTranslation =
//               nodeConfig.horizontalNodeTranslation
//             const x = d.x + nodeConfig.nodeHeight / 2
//             let y = d.y - nodeConfig.nodeWidth + horizontalNodeTranslation
//             const parentX = d.parent.x + nodeConfig.nodeHeight / 2
//             let parentY =
//               d.parent.y - nodeConfig.nodeWidth + horizontalNodeTranslation
//             const paternalNode = parentX > x // if line will come out the top and go to parent.

//             y = y + nodeConfig.nodeWidth
//             parentY = parentY + nodeConfig.nodeWidth

//             if (d.relativeDepth === 1 && d.depth !== 1) {
//               return `M${y} ${x} H${y - 50} V${parentX} H${parentY +
//                 nodeConfig.nodeWidth -
//                 nodeConfig.horizontalMargin}`
//             }

//             if (paternalNode) {
//               return `M${y - horizontalNodeTranslation} ${x} H${parentY +
//                 nodeConfig.nodeWidth / state.prefs.gens} V${parentX -
//                 nodeConfig.nodeHeight / 2}`
//             } else {
//               return `M${y - horizontalNodeTranslation} ${x} H${parentY +
//                 nodeConfig.nodeWidth / state.prefs.gens} V${parentX +
//                 nodeConfig.nodeHeight / 2}`
//             }
//           }
//         }

//         /**
//          * D3 rendering pattern.
//          * Good example by d3 author: https://bl.ocks.org/mbostock/3808218
//          */

//         /**
//          * DATA JOIN
//          * Join new data with old elements, if any.
//          */
//         const links = this.svgContainer
//           .selectAll('.link')
//           .data(root.descendants().slice(1))

//         /**
//          * UPDATE
//          * Update old elements as needed.
//          */
//         links
//           // .style('opacity',0)
//           .transition()
//           .duration(500)
//           // .style('opacity',1)
//           .attr('d', linkLine)

//         /**
//          * ENTER
//          * Create new elements as needed.
//          *
//          * ENTER + UPDATE
//          * After merging the entered elements with the update selection,
//          * apply operations to both.
//          */
//         links
//           .enter()
//           .append('path')
//           .attr('class', 'link')
//           .attr('d', linkLine)

//         /**
//          * EXIT
//          * Remove old elements as needed.
//          */
//         links.exit().remove()

//         /**
//          * @description - Add couple node inline styles
//          * @param {*} d
//          */
//         function coupleStyles(d) {
//           const width = nodeConfig.nodeWidth
//           let height = nodeConfig.nodeHeight
//           let x = d.x
//           const y =
//             config.orientation === 'portrait'
//               ? d.y - config.portrait.nodeWidth / 2
//               : d.y

//           if (
//             (d.relativeDepth === 4 ||
//               d.relativeDepth === 5 ||
//               d.relativeDepth === 6) &&
//             state.prefs.gens === d.relativeDepth
//           ) {
//             height = nodeConfig.nodeHalfHeight
//             x = d.x + nodeConfig.nodeHalfHeight / 2
//           }

//           return `width: ${width}px;
//                           height: ${height}px;
//                           position: absolute;
//                           left: ${y}px;
//                           top: ${x}px;
//                           `
//         }
//         /**
//          * @description - Define properties on pedigree-couple-renderer
//          * @param {object} d - d3 tree node object
//          * @this pedigree-couple-renderer DOM element
//          */
//         function addCoupleRendererProps(d) {
//           if (this.hasAttribute('slow')) {
//             this.innerHTML = ''
//             return
//           }
//           this.coupleId = d.data.id
//           this.couple = d.data

//           this.halfSize = false
//           this.coupleAhnentafel = d.coupleAhnentafel
//             ? d.coupleAhnentafel.toString()
//             : d.data.relativeAhnentafel.toString()

//           this.coords = { x: d.y, y: d.x }

//           if (d.parent && d.parent.data) {
//             if (
//               d.parent.data.person1ParentIds &&
//               d.id.includes(d.parent.data.person1ParentIds)
//             ) {
//               this.child = d.parent.data.person1
//             } else if (
//               d.parent.data.person2ParentIds &&
//               d.id.includes(d.parent.data.person2ParentIds)
//             ) {
//               this.child = d.parent.data.person2
//             }
//           }

//           // sanitize all names
//           this.couple.person1.sanitizedName = FS.htmlEncode(
//             this.couple.person1.name
//           )
//           this.couple.person2.sanitizedName = FS.htmlEncode(
//             this.couple.person2.name
//           )

//           if (this.child) {
//             this.child.sanitizedName = FS.htmlEncode(this.child.name)
//           }

//           if (
//             (d.relativeDepth === 4 ||
//               d.relativeDepth === 5 ||
//               d.relativeDepth === 6) &&
//             state.prefs.gens === d.relativeDepth
//           ) {
//             this.halfSize = true
//           }

//           // OFT-69152: Hide the placeholder couple that only exists
//           // so the rendering of a single female person's ancestors is correct.
//           if (
//             this.couple &&
//             this.couple.person1 &&
//             this.couple.person1.id === 'UNKNOWN'
//           ) {
//             this.hidden = true
//           }

//           this.depth = d.depth

//           this.hasChildrenNodes = !!d.children
//           this.set('pedigreeType', 'ancestors')

//           this.appendable = d.depth % state.prefs.gens === 0 && d.depth > 0
//           setTimeout((_) => {
//             this.loadingPedigree = d.loadingPed
//           }, 100)
//         }

//         /**
//          * @description - Define attributes on pedigree-couple-renderer
//          * @param {object} d - d3 tree node object
//          */
//         function attrs(node) {
//           if (lls) node.attr('lls', lls) // whether we're in lls-mode
//           node
//             .attr('class', 'node')
//             .attr('tabindex', '-1')
//             .attr('style', coupleStyles)
//             .attr('data-test-couple-ahnentafel', (d) => d.coupleAhnentafel)
//         }

//         /**
//          * D3 rendering pattern.
//          * Good example by d3 author: https://bl.ocks.org/mbostock/3808218
//          */

//         /**
//          * DATA JOIN
//          * Join new data with old elements, if any.
//          */
//         const node = this.container
//           .selectAll('pedigree-couple-renderer.node')
//           .data(root.descendants(), (d) => d.id)

//         /**
//          * UPDATE
//          * Update old elements as needed.
//          */
//         node
//           .transition()
//           .duration(500)
//           .call(attrs.bind(this))
//           .each(addCoupleRendererProps)

//         /**
//          * ENTER
//          * Create new elements as needed.
//          *
//          * ENTER + UPDATE
//          * After merging the entered elements with the update selection,
//          * apply operations to both.
//          */

//         node
//           .enter()
//           .append('pedigree-couple-renderer')
//           .call(attrs.bind(this))
//           .each(addCoupleRendererProps)

//         /**
//          * EXIT
//          * Remove old elements as needed.
//          */
//         node.exit().remove()

//         const nodeSlow = this.slowContainer
//           .selectAll('pedigree-couple-renderer.node')
//           .data(root.descendants(), (d) => d.id)

//         nodeSlow.call(attrs.bind(this)).each(addCoupleRendererProps)

//         nodeSlow
//           .enter()
//           .append('pedigree-couple-renderer')
//           .attr('slow', '')
//           .call(attrs.bind(this))
//           .each(addCoupleRendererProps)

//         nodeSlow.exit().remove()

//         // Mark pedigree completion time for initial page load
//         if (
//           !PerfHelpers.getUserTime('V8:pedigree:pedigree-render:duration')
//             .length
//         ) {
//           PerfHelpers.markUserTime('V8:pedigree:pedigree-render:complete')
//           const pedigreeProcessingMeasure = PerfHelpers.measureUserDuration(
//             'V8:pedigree:pedigree-render:duration',
//             'V8:pedigree:pedigree-render:init',
//             'V8:pedigree:pedigree-render:complete'
//           )
//           const pedigreeProcessingTime = Math.ceil(
//             pedigreeProcessingMeasure.duration
//           )

//           FS.debugOn &&
//             console.info(`pedigree render time: ${pedigreeProcessingTime} ms`)

//           // If pedigree processing time takes more than 800 milliseconds, disable reloading of pan/zoom/expansion, and set state.pedigree.slowDevice flag for tree-pedigree._pidObserver to check in order to disable auto-expansion.
//           // TODO: Refactor window.performance-related code into a support wrapper

//           // 2.5 GHz Intel Core i7, with numerous other processes running:
//           // Chrome 60.0.3112.113, 64-bit
//           // // Unthrottled ~100ms
//           // // 6x slowdown ~800ms
//           // Firefox 51.0.1, 64-bit: ~150ms
//           // Safari 11: ~150ms

//           // LEGACY MOBILE DEVICE TYPICAL PEDIGREE PROCESSING TIME:
//           // iphone 7 Safari 11: 1ms
//           // iphone 5 Safari 10.0.3: 600-700ms
//           // HTC One Android 5.0.2 chrome 61 ~950ms
//           // Samsung Galaxy S3 Android 4.4.2 chrome 61 ~1000ms
//           // Nokia Lumia 920 Windows 8.1 IE ~2500ms
//           // Microsoft Lumia 640 LTE Windows 10 Edge 800-1100ms (needs it)

//           if (pedigreeProcessingTime > 800) {
//             console.info('Exceeded maximum JavaScript processing time')

//             // set slowDevice in state
//             __state__.dispatch(__actions__.pedigree.setSlowDevice(true))
//           }
//         }
//       }
//     }

//     /**
//      * @description - Throttle function taken from https://remysharp.com/2010/07/21/throttling-function-calls
//      */
//     function throttle(fn, threshold, scope) {
//       threshold || (threshold = 250)
//       let last, deferTimer
//       return function() {
//         const context = scope || this

//         const now = +new Date()
//         const args = arguments
//         if (last && now < last + threshold) {
//           // hold on to it
//           clearTimeout(deferTimer)
//           deferTimer = setTimeout(function() {
//             last = now
//             fn.apply(context, args)
//           }, threshold)
//         } else {
//           last = now
//           fn.apply(context, args)
//         }
//       }
//     }

//     /**
//      * @description - debouncer function from https://davidwalsh.name/javascript-debounce-function
//      */
//     function debounce(func, wait, immediate) {
//       let timeout
//       return function() {
//         const context = this
//         const args = arguments
//         const later = function() {
//           timeout = null
//           if (!immediate) func.apply(context, args)
//         }
//         const callNow = immediate && !timeout
//         clearTimeout(timeout)
//         timeout = setTimeout(later, wait)
//         if (callNow) func.apply(context, args)
//       }
//     }

//     var saveTransform = debounce((transform) => {
//       if (
//         Number.isNaN(transform.k) ||
//         Number.isNaN(transform.x) ||
//         Number.isNaN(transform.y)
//       ) {
//         return
//       }
//       const pof = __state__.getState().pedigree.pof
//       const orientation = __state__.getState().pedigree.config.orientation
//       Promise.all([
//         _cache.positions.setItem(`${pof}_${orientation}`, transform),
//         _cache.zoom.setItem('zoom', transform.k)
//       ])
//     }, 500)

//     var updateNodesPosition = debounce(
//       (container, slowContainer, { x, y, k }) => {
//         container.attr(
//           'style',
//           `transform: translate(${x}px, ${y}px) scale(${k})`
//         )
//         slowContainer.attr('hidden', '')
//         container.attr('hidden', null)
//       },
//       250
//     )

//     // IE 11 Polyfill
//     Number.isNaN =
//       Number.isNaN ||
//       function(value) {
//         return value !== value // eslint-disable-line no-self-compare
//       }
//   })()
// }.call(window))
