import * as http from "cloudly-http"
import { Collection } from "./Collection"

export class Client<Error = void> extends Collection<Error> {
	set onError(value: ((request: http.Request, response: http.Response) => Promise<boolean>) | undefined) {
		this.client.onError = value
	}
	get onError(): ((request: http.Request, response: http.Response) => Promise<boolean>) | undefined {
		return this.client.onError
	}
	onUnauthorized?: (client: Client) => Promise<boolean>
	set url(value: string | undefined) {
		this.client.url = value
	}
	get url(): string | undefined {
		return this.client.url
	}
	set key(value: string | undefined) {
		this.client.key = value
	}
	get key(): string | undefined {
		return this.client.key
	}
	protected constructor(client: http.Client<Error>) {
		super(client)
		this.client.onUnauthorized = async () => this.onUnauthorized != undefined && (await this.onUnauthorized(this))
	}
	static create<T = void, Error = void>(url?: string, key?: string, load?: (connection: http.Client) => T): Client & T {
		const client = new http.Client<Error>(url, key)
		const result = new Client(client)
		if (load)
			Object.assign(result, load(client))
		return result as Client & T
	}
}
