import { http } from "cloudly-http"

export class Collection<Error = never> {
	protected constructor(protected client: http.Client<Error>) {}
	extend<C extends Collection<Error>>(type: { new (connection: http.Client<Error>): C }): Collection<Error> | C {
		return Object.assign(this, new type(this.client))
	}
}

export namespace Collection {
	export class Creatable<T, Error = never> extends Collection<Error> {
		constructor(client: http.Client<Error>, private readonly path: string | ((item: T) => string)) {
			super(client)
		}
		async create(item: T): Promise<T | Error> {
			return await this.client.post(typeof this.path == "string" ? this.path : this.path(item), item)
		}
	}
}
