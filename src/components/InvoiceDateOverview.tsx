import React, {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {loadInvoiceDateOverview} from '../store/thunk/invoices';
import {DateOverview, InvoiceStatus} from '../models/invoice';
import {selectInvoiceDateOverview} from '../store/selectors/invoices';
import {colors} from '../styles/colors';
import {font} from '../styles/font';
import {EmptyResult} from './EmptyResult';
import {ArrowDownIcon} from './icons/ArrowDown';
import {InvoiceOverview} from '../dto/invoices';
import {clearDateOverview} from '../store/reducers/invoices';
import {InvoiceSmallCard} from './InvoiceSmallCard';

type Props = {
  date?: number[] | null;
  statuses: InvoiceStatus[];
};

export const InvoiceDateOverview: React.FC<Props> = ({
  date = [],
  statuses = [InvoiceStatus.Paid, InvoiceStatus.Unpaid],
}) => {
  const dispatch = useDispatch<any>();
  const dateOverview = useSelector(selectInvoiceDateOverview);

  const [activeSections, setActiveSections] = useState<number[]>([]);

  useEffect(() => {
    return () => {
      dispatch(clearDateOverview());
    };
  }, []);

  useEffect(() => {
    if (!date) {
      return;
    }

    const request: InvoiceOverview = {statuses};
    if (date.length) {
      request.date = date;
    }

    dispatch(loadInvoiceDateOverview(request));
    setActiveSections([0]);
  }, [date]);

  const formattedDateOverview = useMemo(() => {
    const dates = (dateOverview.result || []) as DateOverview[];
    const start = dates.length
      ? moment(dates[0].date).endOf('month')
      : moment().endOf('month');
    const end = dates[dates.length - 1]
      ? moment(dates[dates.length - 1].date).startOf('month')
      : moment().startOf('month');

    const result = [];
    while (start.isSameOrAfter(end)) {
      const items = dates.filter(d => moment(d.date).isSame(start, 'month'));
      if (items.length) {
        result.push({title: start.format('MMMM, yyyy'), items});
      }
      start.subtract(1, 'month');
    }

    return result;
  }, [dateOverview]);

  const renderHeader = ({title}: any, index: number) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View
          style={[
            styles.sectionIcon,
            !activeSections.includes(index) && styles.sectionIconActive,
          ]}>
          <ArrowDownIcon color={colors.gray} />
        </View>
      </View>
    );
  };

  const renderContent = (section: any) => {
    return (
      <View style={styles.content}>
        {(section.items || []).map((item: DateOverview) => {
          return (
            <InvoiceSmallCard
              key={`invoice_date_card_${item._id}`}
              item={item}
            />
          );
        })}
      </View>
    );
  };

  const onChange = (indexes: any) => {
    setActiveSections(indexes);
  };

  if (dateOverview.loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={'large'} color={colors.bluePrimary} />
      </View>
    );
  }

  if (!dateOverview.loading && !formattedDateOverview.length) {
    return <EmptyResult />;
  }

  return (
    <View style={styles.container}>
      <Accordion
        activeSections={activeSections}
        sections={formattedDateOverview}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={onChange}
        underlayColor={'transparent'}
        expandMultiple={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    height: 56,
    marginHorizontal: 24,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionIcon: {},
  sectionIconActive: {
    transform: [{rotate: '180deg'}],
  },
  sectionTitle: {
    color: colors.text.grayText,
    ...font(16, 24),
  },
  content: {
    paddingTop: 20,
  },
});
