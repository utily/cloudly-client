import * as gracely from "gracely"
import * as http from "cloudly-http"

export class Connection {
	onError?: (error: gracely.Error, request: http.Request) => Promise<boolean>
	onUnauthorized?: (connection: Connection) => Promise<boolean>
	private constructor(public server: string | undefined, public key: string | undefined) {}

	private async fetch<Response>(
		path: string,
		method: http.Method,
		body?: any,
		header?: http.Request.Header
	): Promise<Response | gracely.Error> {
		header = {
			contentType: "application/json; charset=utf-8",
			authorization: this.key ? "Bearer " + this.key : undefined,
			...header,
		}

		let result: Response | gracely.Error
		if (!this.server)
			result = gracely.client.notFound("No server configured.")
		else {
			const request = { url: this.server + "/" + path, method, header, body }
			const response = await http.fetch(request).catch(error => console.log(error))
			result = !response
				? gracely.server.unavailable("Failed to reach server.")
				: response.status == 401 && this.onUnauthorized && (await this.onUnauthorized(this))
				? await this.fetch<Response>(path, method, body)
				: ((await response.body) as Response | gracely.Error)
			if (gracely.Error.is(result) && this.onError && (await this.onError(result, http.Request.create(request))))
				result = await this.fetch(path, method, body, header)
		}
		return result
	}
	async get<Response>(path: string, header?: http.Request.Header): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "GET", undefined, header)
	}
	async post<Response>(path: string, request: any, header?: http.Request.Header): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "POST", request, header)
	}
	async put<Response>(path: string, request: any, header?: http.Request.Header): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "PUT", request, header)
	}
	async patch<Response>(path: string, request: any, header?: http.Request.Header): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "PATCH", request, header)
	}
	async delete<Response>(path: string, header?: http.Request.Header): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "DELETE", undefined, header)
	}
	static create(server?: string, key?: string) {
		return new Connection(server, key)
	}
	static async errorToUndefined<T>(body: Promise<T | gracely.Error>): Promise<T | undefined> {
		const b = await body
		return gracely.Error.is(b) ? undefined : b
	}
}
