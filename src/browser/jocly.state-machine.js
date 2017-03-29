/*    Copyright 2017 Jocly
 *
 *    This program is free software: you can redistribute it and/or  modify
 *    it under the terms of the GNU Affero General Public License, version 3,
 *    as published by the Free Software Foundation.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *    As a special exception, the copyright holders give permission to link the
 *    code of portions of this program with the OpenSSL library under certain
 *    conditions as described in each individual source file and distribute
 *    linked combinations including the program with the OpenSSL library. You
 *    must comply with the GNU Affero General Public License in all respects
 *    for all of the code used other than as permitted herein. If you modify
 *    file(s) with this exception, you may extend this exception to your
 *    version of the file(s), but you are not obligated to do so. If you do not
 *    wish to do so, delete this exception statement from your version. If you
 *    delete this exception statement from all source files in the program,
 *    then also delete it in the license file.
 */

function JHStateMachine() {
}

JHStateMachine.prototype={}

JHStateMachine.prototype.init=function() {
	this.smState=null;
	this.smStates={};
	this.smEventQueue=[];
	this.smScheduled=false;
	this.smPauseNotified=false;
	this.smPaused=true;
	this.smHistory=[];
	this.smGroups={};
}

JHStateMachine.prototype.smDebug=function() {}
JHStateMachine.prototype.smWarning=function() {}
JHStateMachine.prototype.smError=function() {}

JHStateMachine.prototype.smTransition=function(states,events,newState,methods) {
	states=this.smSolveStates(states);
	if(typeof(events)=="string") {
		events=[events];
	}
	if(typeof(methods)=="string") {
		methods=[methods];
	}
	for(var s in states) {
		var stateName=states[s];
		if(typeof(this.smStates[stateName])=="undefined") {
			this.smStates[stateName]={
				transitions: {},
				enteringMethods: [],
				leavingMethods: []
			}
		}
		for(var e in events) {
			var eventName=events[e];
			if(typeof(this.smStates[stateName].transitions[eventName])=="undefined") {
				this.smStates[stateName].transitions[eventName]={
					state: (newState!=null)?newState:stateName,
					methods: []
				};
			}
			for(var m in methods) {
				var methodName=methods[m];
				this.smStates[stateName].transitions[eventName].methods.push(methodName);				
			}
		}
	}
	if(newState!=null && typeof(this.smStates[newState])=="undefined") {
		this.smStates[newState]={
			transitions: {},
			enteringMethods: [],
			leavingMethods: []				
		}
	}
}

JHStateMachine.prototype.smEntering=function(states,methods) {
	if(typeof(states)=="string") {
		states=[states];
	}
	if(typeof(methods)=="string") {
		methods=[methods];
	}
	for(var s in states) {
		var stateName=states[s];
		if(typeof(this.smStates[stateName])=="undefined") {
			this.smStates[stateName]={
				transitions: {},
				enteringMethods: [],
				leavingMethods: []
			}
		}
		for(var m in methods) {
			var methodName=methods[m];
			this.smStates[stateName].enteringMethods.push(methodName);				
		}
	}
}

JHStateMachine.prototype.smLeaving=function(states,methods) {
	if(typeof(states)=="string") {
		states=[states];
	}
	if(typeof(methods)=="string") {
		methods=[methods];
	}
	for(var s in states) {
		var stateName=states[s];
		if(typeof(this.smStates[stateName])=="undefined") {
			this.smStates[stateName]={
				transitions: {},
				enteringMethods: [],
				leavingMethods: []
			}
		}
		for(var m in methods) {
			var methodName=methods[m];
			this.smStates[stateName].leavingMethods.push(methodName);				
		}
	}
}

JHStateMachine.prototype.smStateGroup=function(group,states) {
	if(typeof(states)=="string")
		states=[states];
	if(typeof(this.smGroups[group])=="undefined")
		this.smGroups[group]=[];
	states=this.smSolveStates(states);
	for(var i in states) {
		var state=states[i];
		if(!this.smContained(state,this.smGroups[group]))
			this.smGroups[group].push(state);
	}
}

JHStateMachine.prototype.smSetInitialState=function(state) {
	this.smState=state;
}

JHStateMachine.prototype.smGetState=function() {
	return this.smState;
}

JHStateMachine.prototype.smHandleEvent=function(event,args) {
	
	if(typeof(this.smStates[this.smState])=="undefined") {
		console.error("Unknown state '",this.smState,"'");
		return;
	}
	var hEntry={
			date: new Date().getTime(),
			fromState: this.smState,
			event: event,
			methods: []
	}
	try {
		hEntry.args=JSON.stringify(args);
	} catch(e) {
		//console.error("handleEvent(event,...) JSON.stringify(args): ",e);
	}
	
	var transition=this.smStates[this.smState].transitions[event];
	if(typeof(transition)=="undefined") {
		console.warn("JHStateMachine: Event '",event,"' not handled in state '",this.smState,"'");
		return;
	}

	this.smCurrentEvent=event;
	
	var stateChanged=(this.smState!=transition.state);

	if(stateChanged) {
		var leavingMethods=this.smStates[this.smState].leavingMethods;
		for(var i in leavingMethods) {
			try {
				hEntry.methods.push(leavingMethods[i]);
				if(typeof leavingMethods[i]=="function")
					leavingMethods[i].call(this,args);
				else
					this['$'+leavingMethods[i]](args);
			} catch(e) {
				console.error("Exception in leaving [",this.smState,"] --> "+
						(typeof leavingMethods[i]=="function"?leavingMethods[i].name:leavingMethods[i])
				+"(",args,"): ",e);
				throw e;
			}		
		}
	}
	
	for(var i in transition.methods) {
		try {
			hEntry.methods.push(transition.methods[i]);
			if(typeof transition.methods[i]=="function")
				transition.methods[i].call(this,args);
			else
				this['$'+transition.methods[i]](args);
		} catch(e) {
			console.error("Exception in ["+this.smState+"] -- "+event+" --> "+
					(typeof transition.methods[i]=="function"?transition.methods[i].name:transition.methods[i])
				+"(",args,"): ",
					e);
			throw e;
		}
	}
	
	this.smJHStateMachineLeavingState(this.smState,event,args);


	this.smDebug("{",this.smState,"} == [",event,"] ==> {",transition.state,"}");


	this.smState=transition.state;

	if(stateChanged) {
		var enteringMethods=this.smStates[this.smState].enteringMethods;
		for(var i in enteringMethods) {
			try {
				hEntry.methods.push(enteringMethods[i]);
				if(typeof enteringMethods[i]=="function")
					enteringMethods[i].call(this,args);
				else
					this['$'+enteringMethods[i]](args);
			} catch(e) {
				console.error("Exception in entering ["+this.smState+"] --> "+
						(typeof enteringMethods[i]=="function"?enteringMethods[i].name:enteringMethods[i])
				+"(",args,"): ",e);
				throw e;
			}		
		}
	}
	
	this.smCurrentEvent=null;

	this.smJHStateMachineEnteringState(this.smState,event,args);
	
	hEntry.toState=this.smState;
	this.smHistory.splice(0,0,hEntry);
	while(this.smHistory.length>50)
		this.smHistory.pop();	
}

JHStateMachine.prototype.smPlay=function() {
	var $this=this;
	if(this.smPaused) {
		this.smPaused=false;
		setTimeout(function() {
			$this.smRun();
		},0);
	}
}

JHStateMachine.prototype.smPause=function() {
	this.smPaused=true;
}

JHStateMachine.prototype.smStep=function() {
	this.smPauseNotified=false;
	if(this.smEventQueue.length>0) {
		var eventItem=this.smEventQueue.shift();
		this.smHandleEvent(eventItem.event,eventItem.args);
	}
	this.smNotifyPause();
}

JHStateMachine.prototype.smRun=function() {
	this.smScheduled=false;

	var stepCount=0;
	while(this.smEventQueue.length>0) {
		if(this.smPaused) {
			this.smRunEnd(stepCount);
			return;
		} else {
			stepCount++;
			this.smStep();
		}
	}
	while(this.smPaused==false && this.smEventQueue.length>0) {
		stepCount++;
		this.smStep();
	}
	this.smRunEnd(stepCount);
}

JHStateMachine.prototype.smRunEnd=function() {
}

JHStateMachine.prototype.smQueueEvent=function(event,args) {
	var self=this;
	this.smEventQueue.push({event: event, args: args});
	this.smNotifyPause();
	if(!this.smScheduled) {
		this.smScheduled=true;
		setTimeout(function() {
			self.smRun();
		},0);
	}
}

JHStateMachine.prototype.smNotifyPause=function() {
	if(this.smEventQueue.length>0 && this.smPaused==true) {
		var item=this.smEventQueue[0];
		this.smJHStateMachinePaused(item.event,item.args);
	}
}

JHStateMachine.prototype.smJHStateMachineEnteringState=function(state,event,args) {
}

JHStateMachine.prototype.smJHStateMachineLeavingState=function(state,event,args) {
}

JHStateMachine.prototype.smJHStateMachinePaused=function(state,event,args) {
}

JHStateMachine.prototype.smGetTable=function() {
	var cells={}
	for(var s in this.smStates) {
		var state=this.smStates[s];
		for(var e in state.transitions) {
			var toState=state.transitions[e].state;
			var cellname=s+"/"+toState;
			if(typeof(cells[cellname])=="undefined") {
				cells[cellname]={};
			}
			cells[cellname][e]=[];
			if(s!=toState) {
				for(var m in state.leavingMethods) {
					cells[cellname][e].push(state.leavingMethods[m]);
				}
			}
			for(var m in state.transitions[e].methods) {
				cells[cellname][e].push(state.transitions[e].methods[m]);
			}
			if(s!=toState) {
				for(var m in this.smStates[toState].enteringMethods) {
					cells[cellname][e].push(this.smStates[toState].enteringMethods[m]);
				}
			}
		}
	}
	var table=["<table><tr><td></td>"];
	for(var s in this.smStates) {
		table.push("<td class='state'>"+s+"</td>");
	}
	table.push("</tr>");
	for(var s1 in this.smStates) {
		table.push("<tr><td class='state'>"+s1+"</td>");
		var state1=this.smStates[s1];
		for(var s2 in this.smStates) {
			var state2=this.smStates[s2];
			var cellname=s1+"/"+s2;
			if(typeof(cells[cellname])=="undefined") {
				table.push("<td class='empty'></td>");
			} else {
				table.push("<td class='transition'>");
				for(var e in cells[cellname]) {
					table.push("<div class='event'>");
					table.push("<div class='eventname'>"+e+"</div>");
					for(var m in cells[cellname][e]) {
						table.push("<div class='method'>"+cells[cellname][e][m]+"</div>");
					}
					table.push("</div>");
				}
				table.push("</td>");
			}
		}
		table.push("</tr>");
	}
	table.push("</table>");
	return table.join("");
}

JHStateMachine.prototype.smGetHistoryTable=function() {
	var table=["<table><tr><th>Date</th><th>To</th><th>Event</th><th>Methods</th><th>From</th></tr>"];
	for(var i in this.smHistory) {
		var hEntry=this.smHistory[i];
		table.push("<tr>");
		var date=new Date(hEntry.date);
		var timestamp=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"."+date.getMilliseconds();
		table.push("<td class='timestamp'>"+timestamp+"</td>");
		table.push("<td class='to'>"+hEntry.toState+"</td>");
		table.push("<td><div class='event'>"+hEntry.event+"</div><div class='args'>("+hEntry.args+")</div></td>");
		table.push("<td class='methods'>");
		for(var j in hEntry.methods) {
			table.push(hEntry.methods[j]+"<br/>");
		}
		table.push("</td>");
		table.push("<td class='from'>"+hEntry.fromState+"</td>");
		table.push("</tr>");		
	}
	table.push("</table>");
	return table.join("");
}

JHStateMachine.prototype.smSolveStates=function(states) {
	var states0=[];
	if(typeof(states)=="string") {
		states=[states];
	}
	for(var s in states) {
		var state=states[s];
		if(typeof(this.smGroups[state])=="undefined") {
			if(!this.smContained(state,states0))
				states0.push(state);
		} else {
			for(var s0 in this.smGroups[state])
				if(!this.smContained(this.smGroups[state][s0]),states0)
					states0.push(this.smGroups[state][s0]);
		}
	}
	return states0;
}

JHStateMachine.prototype.smContained=function(state,group) {
	for(var i in group) {
		if(state==group[i])
			return true;
	}
	return false;
}

JHStateMachine.prototype.smCheck=function() {
	var result={
		missing: [],
		unused: []
	}
	var existingFnt=[];
	for(var s in this.smStates) {
		for(var i in this.smStates[s].enteringMethods) {
			var fnt=this.smStates[s].enteringMethods[i];
			existingFnt[fnt]=true;
		}
		for(var i in this.smStates[s].leavingMethods) {
			var fnt=this.smStates[s].leavingMethods[i];
			existingFnt[fnt]=true;
		}
		for(var e in this.smStates[s].transitions) {
			var event=this.smStates[s].transitions[e];
			for(var i in event.methods) {
				var fnt=event.methods[i];
				existingFnt[fnt]=true;
			}
		}
	}
	for(var fnt in existingFnt) {
		if(typeof(this['$'+fnt])!="function") {
			result.missing.push(fnt);
			console.error("JHStateMachine: missing function $",fnt);
		}
	}
	for(var k in this) {
		try {
			if(k[0]=='$' && typeof(this[k])=="function") {
				var fnt=k.substr(1);
				if(typeof(existingFnt[fnt])=="undefined") {
					//this.warning("JHStateMachine.check "+this.target.name+": unused function "+k);
					result.unused.push(fnt);
				}
			}
		} catch(e) {}
	}
	return result;
}
