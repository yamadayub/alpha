"""Remove growth from portfolio

Revision ID: e7fccbf7b72b
Revises: ed2785d1d715
Create Date: 2023-05-25 06:06:41.990355

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e7fccbf7b72b'
down_revision = 'ed2785d1d715'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    # op.drop_table('alembic_version')
    op.drop_column('portfolios', 'growth')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('portfolios', sa.Column(
        'growth', sa.REAL(), autoincrement=False, nullable=True))
    # op.create_table('alembic_version',
    #                 sa.Column('version_num', sa.VARCHAR(length=32),
    #                           autoincrement=False, nullable=False),
    #                 sa.PrimaryKeyConstraint(
    #                     'version_num', name='alembic_version_pkc')
    #                 )
    # ### end Alembic commands ###
