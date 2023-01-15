import * as LibHosts from '/lib/Hosts'
import * as LibConstants from '/lib/Constants'
import * as LibColoredText from '/lib/ColoredText'

export const Hosts = LibHosts;
export const Constants = LibConstants;
export const ColoredText = LibColoredText;

// Deploys all files in the library to hostname
export async function deploy(ns, hostname) {
	await ns.scp(ns.ls(Constants.HOME_HOST, Constants.LIB_DIR), hostname, Constants.HOME_HOST);
}