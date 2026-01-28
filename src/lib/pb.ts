import PocketBase, { type RecordModel } from 'pocketbase'

export const pb = new PocketBase()

export interface BaseModel extends RecordModel {
	created: string
	updated: string
}

export interface Device extends BaseModel {
	user: string
	name: string
	endpoint: string
}

export interface User extends BaseModel {
	email: string
	remaining_bytes: number
	expand: {
		psc?: string
	}
}

export interface Endpoint extends BaseModel {
	user: string
	device: string
	transmit_bytes: number
	token: string
	expand: {
		device: Device
	}
}

export interface Connection extends BaseModel {
	user: string
	endpoint: string
	transmit_bytes: number
	disconnected: string
}

export interface Order extends BaseModel {
	user: string
	status: string[]
	value: number
	bytes: number
	payment_link: string
}

export function errStr(err: any): string {
	console.error(err)
	if (typeof err === 'string') {
		return err
	}
	if (err instanceof Error) {
		return err.message
	}
	return '未知错误'
}

export function Money(s: number) {
	let str = (s / 100).toFixed(2)
	str = `${str} 元`
	return str
}
