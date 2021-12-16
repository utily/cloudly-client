import { Client } from "./index"

describe("cloudly-client", () => {
	it("create", () => {
		expect(Client.create()).toMatchObject({ a: 12 })
	})
})
