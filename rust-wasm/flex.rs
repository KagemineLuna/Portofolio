// A digital monument to doing absolutely nothing, meticulously crafted for GitHub.
// This is not code. This is art.

#[allow(dead_code)]
fn main() {
    // The core of our masterpiece: a 2 MB array of zeroes.
    // It's just sitting here, taking up space and looking important.
    const ONE_MB: usize = 1024 * 1024;
    let large_array: [u8; ONE_MB * 2] = [0; ONE_MB * 2];

    // The compiler sees this and thinks, "What a waste of my time."
    // And we, the artists, smile. Because that was the point all along.

    // To add a little spice and make sure the compiler doesn't completely ignore our work of art,
    // we can use a tiny, inconsequential piece of the array.
    // It's like signing your name on a blank canvas.
    println!("The first byte of our magnificent creation is: {}", large_array[0]);

    // This ensures our 2 MB masterpiece isn't optimized into oblivion.
    // We want that compile time to count, even if it's for nothing.
                                         }
