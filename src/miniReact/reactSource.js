
/************************************************* react备忘录 *************************************************/

// useDeferValue 原理 核心代码如下
// 判断当前优先级中是否存在 同步优先级 用户连续输入优先级 和 请求数据返回后触发更新
function includesOnlyNonUrgentLanes(lanes) {
  var UrgentLanes = SyncLane | InputContinuousLane | DefaultLane;
  return (lanes & UrgentLanes) === NoLanes;
}

function updateDeferredValueImpl(hook, prevValue, value) {
  // 如果不存在，则需要延迟当前的更新，即当前更新优先级较低
  var shouldDeferValue = !includesOnlyNonUrgentLanes(renderLanes);

  if (shouldDeferValue) {
    // This is an urgent update. If the value has changed, keep using the
    // previous value and spawn a deferred render to update it later.
    if (!objectIs(value, prevValue)) {
      // Schedule a deferred render
      // 获取一个transition优先级
      var deferredLane = claimNextTransitionLane();
      currentlyRenderingFiber$1.lanes = mergeLanes(currentlyRenderingFiber$1.lanes, deferredLane);
      markSkippedUpdateLanes(deferredLane); // Set this to true to indicate that the rendered value is inconsistent
      // from the latest value. The name "baseState" doesn't really match how we
      // use it because we're reusing a state hook field instead of creating a
      // new one.

      hook.baseState = true;
    } // Reuse the previous value


    return prevValue;
  } else {
    // This is not an urgent update, so we can use the latest value regardless
    // of what it is. No need to defer it.
    // However, if we're currently inside a spawned render, then we need to mark
    // this as an update to prevent the fiber from bailing out.
    //
    // `baseState` is true when the current value is different from the rendered
    // value. The name doesn't really match how we use it because we're reusing
    // a state hook field instead of creating a new one.
    if (hook.baseState) {
      // Flip this back to false.
      hook.baseState = false;
      markWorkInProgressReceivedUpdate();
    }

    hook.memoizedState = value;
    return value;
  }
}

// useTransition 原理 核心代码如下
// useTransition返回的方法为startTransition，其实只是给一个上下文，即ReactCurrentBatchConfig$2.transition
// 在触发callback（假设callback为setState），那在触发setState时，会通过requestUpdateLane为每个update更新添加优先级，这个方法中会根据这个上下文判断当前是否是transition更新动作
// 如果当前的更新被分配了transition优先级，那如果有更高优先级的更新则会先处理更高优先级的更新，并且讲更新commit
// commitRootImpl方法中会再次调用ensureRootIsScheduled处理剩余的更新，如transition优先级的更新
function startTransition(setPending, callback, options) {
  var previousPriority = getCurrentUpdatePriority();
  setCurrentUpdatePriority(higherEventPriority(previousPriority, ContinuousEventPriority));
  setPending(true);
  var prevTransition = ReactCurrentBatchConfig$2.transition;
  ReactCurrentBatchConfig$2.transition = {};
  var currentTransition = ReactCurrentBatchConfig$2.transition;

  {
    ReactCurrentBatchConfig$2.transition._updatedFibers = new Set();
  }

  try {
    setPending(false);
    callback();
  } finally {
    setCurrentUpdatePriority(previousPriority);
    ReactCurrentBatchConfig$2.transition = prevTransition;

    {
      if (prevTransition === null && currentTransition._updatedFibers) {
        var updatedFibersCount = currentTransition._updatedFibers.size;

        if (updatedFibersCount > 10) {
          warn('Detected a large number of updates inside startTransition. ' + 'If this is due to a subscription please re-write it to use React provided hooks. ' + 'Otherwise concurrent mode guarantees are off the table.');
        }

        currentTransition._updatedFibers.clear();
      }
    }
  }
}

function requestUpdateLane(fiber) {
  // Special cases
  var mode = fiber.mode;

  if ((mode & ConcurrentMode) === NoMode) {
    return SyncLane;
  } else if ( (executionContext & RenderContext) !== NoContext && workInProgressRootRenderLanes !== NoLanes) {
    // This is a render phase update. These are not officially supported. The
    // old behavior is to give this the same "thread" (lanes) as
    // whatever is currently rendering. So if you call `setState` on a component
    // that happens later in the same render, it will flush. Ideally, we want to
    // remove the special case and treat them as if they came from an
    // interleaved event. Regardless, this pattern is not officially supported.
    // This behavior is only a fallback. The flag only exists until we can roll
    // out the setState warning, since existing code might accidentally rely on
    // the current behavior.
    return pickArbitraryLane(workInProgressRootRenderLanes);
  }

  var isTransition = requestCurrentTransition() !== NoTransition;

  // 如果当前是transition状态，则分配一个transition类型的优先级
  if (isTransition) {
    if ( ReactCurrentBatchConfig$3.transition !== null) {
      var transition = ReactCurrentBatchConfig$3.transition;

      if (!transition._updatedFibers) {
        transition._updatedFibers = new Set();
      }

      transition._updatedFibers.add(fiber);
    } // The algorithm for assigning an update to a lane should be stable for all
    // updates at the same priority within the same event. To do this, the
    // inputs to the algorithm must be the same.
    //
    // The trick we use is to cache the first of each of these inputs within an
    // event. Then reset the cached values once we can be sure the event is
    // over. Our heuristic for that is whenever we enter a concurrent work loop.


    if (currentEventTransitionLane === NoLane) {
      // All transitions within the same event are assigned the same lane.
      currentEventTransitionLane = claimNextTransitionLane();
    }

    return currentEventTransitionLane;
  } // Updates originating inside certain React methods, like flushSync, have
  // their priority set by tracking it with a context variable.
  //
  // The opaque type returned by the host config is internally a lane, so we can
  // use that directly.
  // TODO: Move this type conversion to the event priority module.


  var updateLane = getCurrentUpdatePriority();

  if (updateLane !== NoLane) {
    return updateLane;
  } // This update originated outside React. Ask the host environment for an
  // appropriate priority, based on the type of event.
  //
  // The opaque type returned by the host config is internally a lane, so we can
  // use that directly.
  // TODO: Move this type conversion to the event priority module.


  var eventLane = getCurrentEventPriority();
  return eventLane;
}

function createCount(root) {
  if (!root) return 

  const result = {
    depth: 0,
    types: new Set(), 
    depthestNode: null
  }

  function dfs(root, depth) {
    
    result.depth = Math.max(result.depth, depth)
    result.types.add(root.nodeName)

    if (!root.childNodes || !root.childNodes.length) {
      result.depthestNode = root
      return
    }
    Array.from(root.childNodes).forEach((node) => {
      if (node) {
        dfs(node, depth + 1)
      }
    })
  }

  dfs(root, result.depth)

  return result
}


function reserveChildren(root) {
  if (!root) return root
  
  function createFiber(sourceNode) {
    return {
      type: sourceNode.nodeName,
      stateNode: sourceNode,
      return: null,
      next: null,
      sibling: null,
      children: sourceNode.childNodes?.length ? Array.from(sourceNode.childNodes) : null 
    }
  }

  const rootFiber = createFiber(root)
  
  function dfs(curNode) {

    if (!curNode.children || !curNode.children.length) {
      return
    }

    const childArr = curNode.children

    let prevNode = null
    for (let index = childArr.length - 1; index >= 0; index --) {
      const child = childArr[index];

      const newFiber = createFiber(child)
      newFiber.return = curNode

      if (index === childArr.length - 1) {
        curNode.next = newFiber
      }

      if (prevNode) {
        prevNode.sibling = newFiber
      }

      prevNode = newFiber

      if (newFiber.stateNode) {
        dfs(newFiber)
      }
      
    }
  }

  dfs(rootFiber)

  return rootFiber
}



