var head = document.getElementsByTagName('head')[0];

var	initInProgress = false;
var hasBeenInitialized = false;
var _queue = [];

function getResource (aURL) {
	var sa = [].map.call(document.scripts, function (x) { return x.src; }).concat([].map.call(document.styleSheets, function (x) { return x.href; }));
	var	us = aURL.toLowerCase().replace('/stratum', '');
	var ii;

	for (ii = 0; ii < sa.length; ii++) {
		if (sa[ii] && sa[ii].toLowerCase().indexOf(us) >= 0) {
			return sa[ii];
		}
	}
	return null;
}

function loadEnvironment (aCallback) {
	const { Ext, Repository, assignProfileSite, assignProfileContext } = window;
	Ext.Ajax.request({ url: '/stratum/api/configurations/globals', method: 'GET',
		success: function (r1) {
			var o1 = Ext.decode(r1.responseText).data;

			Repository.StratumVersion = o1.StratumVersion;
			Repository.DeploymentMode = o1.DeploymentMode;
			Repository.Global = {
				Methods: Ext.decode(o1.Methods),
			};
			Ext.Ajax.request({ url: '/stratum/api/authentication/context', method: 'GET',
				success: function (r2) {
					var o2 = r2.responseText && Ext.decode(r2.responseText).data;

					if (!o2) { // Not https or not authenticated.
						// TODO: should Profile.Site be loaded here?
						// console.log('Stratum.containers: %o', window.Stratum && window.Stratum.containers);
						aCallback();
						return;
					}
					// Need to get complete Register entity since scripts are not included in above call.
					Ext.Ajax.request({ url: '/stratum/api/metadata/registers/' + o2.Unit.Register.RegisterID, method: 'GET',
						success: function (r3) {
							var o3 = r3.responseText && Ext.decode(r3.responseText).data;

							o3.Site.Register = o3; // Reestablish owner reference, since following calls reference Register through Site.
							assignProfileSite(o3.Site);
							assignProfileContext(o2); // Yes, o2 is correct :-)
							// console.log('Stratum.containers: %o', window.Stratum && window.Stratum.containers);
							aCallback();
						},
					});
				},
			});
		},
	});
}

function inject (aResourceList, aReadyCallback, target) {
	var cc = aResourceList.length;
	var uc;
	var ia;
	var rn;

	function loaded () {
		if (this.readyState && this.readyState !== 'complete') { // IE behaviour.
			return;
		}
		cc--;
		if (cc === 0) {
			aReadyCallback();
		}
	};

	for (ia = 0; ia < aResourceList.length; ia++) {
		uc = aResourceList[ia];
		if (getResource(uc) && uc.indexOf('api/widgets') < 0) { // Do not not if already loaded, except for widgets.
			cc--;
			if (cc === 0) {
				aReadyCallback();
				return;
			}
			continue;
		}
		if (uc.indexOf('.css') > 0) {
			rn = document.createElement('link');
			rn.href = uc;
			rn.rel = 'stylesheet';
			rn.type = 'text/css';
		} else { // Assume JavaScript (.js, .ashx).
			rn = document.createElement('script');
			rn.src = uc;
			rn.async = false;
			rn.defer = false;
		}
		// console.log(getResource(uc));
		rn.onload = rn.onreadystatechange = loaded;
		head.appendChild(rn);
	}
}

export function startRegistrations (target = 'sw-registrations', callback = () => {}) {
	const { Ext, Stratum, Repository, initializeExtJS, Profile } = window;
	var pn = Ext.get(target);

	if (!pn) {
		callback({ success: false, cancelled: true, error: `Kunde inte hitta element "${target}" för registreringsapplikationen.` });
		return;
	}
	callback({ success: true });
	Stratum.showError = function (aMessage) {
		pn.createChild({
			cls: 'alert alert-danger',
			style: 'font-size: medium',
			html: '<div role="alert">' + (typeof aMessage === 'string' ? aMessage : 'Du saknar behörighet att se denna sida. Har du loggat in till rätt register och vårdenhet?') + '</div>',
		}, pn.first());
	};
	Stratum.isEmbedded = true;
	initializeExtJS();
	loadEnvironment(function () {
		if (!Profile.Context) {
			Stratum.showError('Du behöver vara inloggad för att arbeta med registreringar. Logga in först och försök igen.');
			return;
		}
		/*
		if (isInProductionMode())  {
			Stratum.showError('Obs! Du är inloggad i Stratum så tänk på att det är <b>skarpa data</b> som visas här!');
		}
		*/
		pn.createChild({ id: 'TopbarPanel', style: 'height: 48px; margin-bottom: 18px; padding: 6px 0px 4px 0px; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd' });
		pn.createChild({ id: 'MiddlePanel' });
	//	ss = getCSSRule('.navbar-default .navbar-nav > li > a:hover, .navbar-default .navbar-brand:hover'); //TODO: can we grab some primary color in a more direct way?
		Ext.util.CSS.createStyleSheet(
			'#sidebarPanel { padding: 10px 0px; } '
			+ '#contentPanel { padding: 10px 20px 0px 30px; }'
			+ '.EventFormPanel label { font-weight: normal; } '
			+ '.NavigationAnchor { width: 100%; border-color: transparent; } '
		//	'.NavigationAnchor.Selected { background-color: ' + (ss ? ss.style.color : '#efefef') + ' } '
		);
		window.onhashchange = function (anEvent, forceReload) {
			var lc = Stratum.getLocation();

			if (Repository.CurrentLocation === location.hash && !forceReload) {
				return;
			}
			switch (lc.hash) {
				case 'subject':
				case 'event':
				case 'form':
				case 'profile':
					Stratum.ApplicationForRegistrations(lc.hash, lc.query);
					break;
				case 'page':
					lc.query.scope = 1;
					Stratum.ApplicationForRegistrations(lc.hash, lc.query);
					break;
				default:
					Stratum.ApplicationForRegistrations('page', { id: Profile.Site.FirstPage.PageID, scope: 1 });
					break;
			}
		};
		window.onhashchange(null, true);
	});
}

export function startWidget (target, widget, queryString, callback = () => {}) {
	const { Stratum, Ext, initializeExtJS } = window;
	Stratum.isEmbedded = true; // To tell Stratum that calls are made from in an embedded scenario.
	Stratum.containers = Stratum.containers || {};
	Stratum.containers[widget] = target;
	initializeExtJS();
	Ext.tip.QuickTipManager.init();
	loadEnvironment(function () {
		const targetNode = document.getElementById(target);
		// console.log('@before script inject ---- \ntarget: %s, target-in-dom: %o, widget: %s, stratum-target: %s\nAll equal: %o',
		// 	target,
		// 	targetNode,
		// 	widget,
		// 	Stratum.containers[widget],
		// 	target === Stratum.containers[widget] && !!targetNode
		// );
		if (targetNode) {
			inject(['/stratum/api/widgets/' + widget + queryString], callback);
		} else {
			callback({ cancelled: true, success: false });
		}
	});
}
/**
 * Queue functions
 */
function queue (fn) {
	_queue.push(fn);
}
function resumeQueue () {
	setInitInProgress(false);
	_queue.forEach(fn => fn());
	_queue = [];
}
function setInitInProgress (status) {
	initInProgress = !!status;
}
function getInitProgress () {
	return initInProgress;
}

function setHasBeenInitialized (status) {
	hasBeenInitialized = status;
}
function getHasBeenInitialized () {
	return hasBeenInitialized;
}

function injectWithCacheBusting (urisToInject, startFunction) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			const response = JSON.parse(this.responseText).data;
			const stratumVersion = response.StratumVersion;
			const versionizedInjects = urisToInject.map(function (current) {
				current = current + '?sv=' + stratumVersion;
				return current;
			});

			inject(
				versionizedInjects,
				() => { setHasBeenInitialized(true); startFunction(); }
			);
		}
	};
	xhttp.open('GET', `/stratum/api/configurations/globals?_=${(new Date()).getTime()}`, true);
	xhttp.send();
}
export default function (target, widget, queryString = '', callback = () => {}) {
	if (!target || !widget) {
		return;
	}
	const doInjects = () => {
		const startFn = widget === 'registrations'
			? () => startRegistrations(target, (...args) => { resumeQueue(); callback(...args); })
			: () => startWidget(target, widget, queryString, (...args) => { resumeQueue(); callback(...args); });

		// Always load all stratum scripts to avoid missing variables when loading registration application.
		if (!getHasBeenInitialized()) {
			var urisToInject = [
				'/stratum/ExtJS/packages/ext-theme-stratum/build/resources/ext-theme-stratum-all_01.css',
				'/stratum/ExtJS/packages/sencha-charts/build/crisp/resources/sencha-charts-all.css',
				'/stratum/Default2.css',
				'/stratum/ExtJS/ext-all.js',
				'/stratum/ExtJS/packages/ext-locale/build/ext-locale-sv_SE.js',
				'/stratum/ExtJS/packages/sencha-charts/build/sencha-charts.js',
				'/stratum/Directs/Handlers/ScriptGenerator.ashx',
				'/stratum/Scripts/Repository.js',
				'/stratum/Scripts/ManagerForSubjects.js',
				'/stratum/Scripts/ApplicationForRegistrations.js',
			];
			injectWithCacheBusting(urisToInject, startFn);
		} else {
			startFn();
		}
	};
    // Queue initialization of widgets if an initialization is already in progress..
	// TODO: Add timout to initialization to avoid halt
	if (getInitProgress()) {
		queue(doInjects);
	} else {
		setInitInProgress(true);
		doInjects();
	}

};
