#[oracle(getSqrt)]
unconstrained fn sqrt(input: [Field; 2]) -> [Field; 2] {}

unconstrained fn get_sqrt(input: [Field; 2]) -> [Field; 2] {
    sqrt(input)
}

fn main(input: [Field; 2]) {
    let sqrt = get_sqrt(input);
    assert(sqrt[0].pow_32(2) as u64 == input[0] as u64);
    assert(sqrt[1].pow_32(2) as u64 == input[1] as u64);
}

#[test]
fn test_sqrt() {
    let input = [
        9,
        16
    ];
    main(input);
}
