// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions
module enoki_play::main;

use std::string::{Self, String};

public struct Thing has key, store {
    id: UID,
    health: u64,
    name: String,
}

public fun new_thing(ctx: &mut TxContext): Thing {
    let thing = Thing {
        id: object::new(ctx),
        health: 100,
        name: string::utf8(b"enoki"),
    };

    thing
}

public fun update_thing(
    thing: &mut Thing,
    health: u64,
    name: String,
    _ctx: &mut TxContext,
) {
    thing.health = health;
    thing.name = name;
}
