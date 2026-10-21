import { describe, expect, it } from "vitest";
import { allListings, catalogListings, filterListings, getListing, listings } from "@/lib/listings";

describe("Merged Chevrolet catalog", () => {
  it("preserves both collections and unique detail identities", () => {
    expect(catalogListings).toHaveLength(6);
    expect(listings).toHaveLength(3);
    expect(new Set(allListings.map((item) => item.id)).size).toBe(9);
    for (const listing of allListings) expect(getListing(listing.id)).toBe(listing);
  });
  it("preserves imported suggested prices", () => {
    expect(catalogListings.map((item) => item.price)).toEqual([89990, 99990, 129990, 119990, 219990, 249990]);
  });
  it("filters catalog SUVs without including other categories", () => {
    expect(filterListings(catalogListings, "SUV").map((item) => item.id)).toEqual(["catalogo-tracker", "catalogo-equinox"]);
    expect(filterListings(listings, "Minivan")).toEqual([]);
    expect(filterListings(catalogListings, "Todos")).toHaveLength(6);
  });
});