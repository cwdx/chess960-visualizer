# Chess960 Visualizer

This visualizer helps you explore all 960 possible starting positions in Chess960 (also known as Fischer Random Chess), a chess variant where the positions of the main pieces on the first rank are randomized according to specific rules.

## About Chess960

Chess960 was invented by former world chess champion Bobby Fischer to reduce the emphasis on opening preparation and to encourage creativity in play. It follows the same rules as standard chess but with randomized starting positions, making it impossible to rely on memorized opening theory.

## Position Rules

Each Chess960 position follows these rules:

- Bishops must be placed on opposite-colored squares
- The king must be placed between the two rooks
- Pawns remain in their standard positions

This results in exactly 960 possible valid starting positions.

## How Positions Are Generated

The algorithm to generate positions works as follows:

1. **First Bishop Placement**: Dividing the position number by 4 gives a remainder (0-3) that determines which light square (b, d, f, h) gets the first bishop
2. **Second Bishop Placement**: Further division places the second bishop on a dark square (a, c, e, g)
3. **Queen Placement**: The next division places the queen on one of the remaining squares
4. **Knight Placement**: A lookup table determines where to place the two knights
5. **King and Rooks**: The remaining three squares have the king in the middle and rooks on the outside

## Strategic Considerations

Different starting positions create unique strategic opportunities:

- Some positions have exposed pawns that can be immediately attacked
- The placement of bishops affects long-term strategic plans
- Knight positioning may offer early tactical opportunities
- Castling is still allowed but follows special rules in Chess960

## App Features

- **Navigation**: Use arrows to move through different positions or enter a specific position number
- **Quick Access**: Jump to the standard chess position (518) or get a random position
- **Theme Selection**: Choose different chess piece fonts to display the board
- **Board Orientation**: Flip the board to view positions from either perspective
- **FEN Notation**: View the FEN (Forsyth-Edwards Notation) for each position

## Castling in Chess960

In Chess960, castling still ends with the king and rook in the same positions as in traditional chess:

- **Kingside castling (O-O)**: The king ends on g1/g8 and the rook on f1/f8
- **Queenside castling (O-O-O)**: The king ends on c1/c8 and the rook on d1/d8

All normal castling rules still apply: neither piece can have moved before, the king cannot move through check, and all squares between must be empty.

## Interesting Facts

- The standard chess starting position is number 518 in Chess960
- Chess960 has been played by many top grandmasters, including Magnus Carlsen and Hikaru Nakamura
- The first FIDE World Fischer Random Chess Championship was held in 2019, won by Wesley So
- The latest champion is Hikaru Nakamura, who won the title in 2022
- In about 90 of the 960 starting positions, players must give up castling rights on one side to castle on the other
