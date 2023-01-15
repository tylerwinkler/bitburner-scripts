import * as Constants from '/lib/constants'

/** 
 * Returns an array of all hostnames
 */
export function getAllHostnames(ns) {
	return getAllHosts(ns).map(h => h.name);
}

// Filters an array of hostnames down to the set of currently hackable servers
export function reduceToHackableServers(ns, hosts) {
	return hosts.filter(h => ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(h)) // Can hack
		.filter(h => h != Constants.HOST_HOME && !h.startsWith(Constants.PURCHASED_SERVER_PREFIX)) // Not home or a slave
		.filter(h => ns.getServerMaxMoney(h) > 0) // Has potential for money
		.filter(h => ns.hasRootAccess(h)); // Has root access (Also needed for hack)
}

// Filters an array of hostnames down to the set of currently rooted servers
export function reduceToRootedServers(ns, hosts) {
	return hosts.filter(h => ns.hasRootAccess(h)) // Has root access
		.filter(h => ns.getServerMaxRam(h) > 0); // Can execute scripts
}

export function getAllHackableHosts(ns) {
	return reduceToHackableServers(ns, getAllHostnames(ns));
}

export function getAllRootedHosts(ns, includeOwnedServers) {
	if (includeOwnedServers === undefined) {
		includeOwnedServers = true;
	}

	let hosts = reduceToRootedServers(ns, getAllHostnames(ns));

	if (!includeOwnedServers) {
		hosts = hosts.filter(h => h != Constants.HOST_HOME && !ns.getPurchasedServers().includes(h));
	}

	return hosts;
}

export function subtractHosts(hostList, hostsToSubtract) {
	let newList = [];
	for (let i = 0; i < hostList.length; ++i) {
		if (!hostsToSubtract.includes(hostList[i])) {
			newList.push(hostList[i]);
		}
	}
	return newList;
}

/** 
 * Returns an array containing a path from the home server to a specified server. No idea what happens when a hostname that doesnt exist is used.
 */
export function findPath(ns, hostname) {
	let servers = getAllHosts(ns);

	let path = [hostname];

	let noPath = false;
	while (!noPath) {
		noPath = true;
		for (let s of servers) {
			if (s.name === hostname) {
				hostname = s.origin;
				if (hostname !== null) {
					path.push(s.origin);
					//ns.tprint(path.join());
					noPath = false;
				}
			}
		}
	}

	return path.reverse();
}

// NOT EXPORTED
/** 
 * Returns an array of object pairs containing the hostname and origin for each server available
 */
function getAllHosts(ns) {
	let scanList = [{ name: Constants.HOST_HOME, origin: null }];

	for (let i = 0; i < scanList.length; ++i) {
		let servers = ns.scan(scanList[i].name);
		for (let j = 0; j < servers.length; ++j) {
			if (!scanList.find((s) => s.name === servers[j])) {
				scanList.push({ name: servers[j], origin: scanList[i].name });
			}
		}
	}

	return scanList;
}