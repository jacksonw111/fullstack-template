"""permissions

Revision ID: b2d464b93072
Revises: 3f89e5cd53c3
Create Date: 2024-09-04 14:05:51.898502

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "b2d464b93072"
down_revision: Union[str, None] = "3f89e5cd53c3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(
        "uq_role_permission", "role_permissions", ["role_id", "permission"]
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint("uq_role_permission", "role_permissions", type_="unique")
    # ### end Alembic commands ###
