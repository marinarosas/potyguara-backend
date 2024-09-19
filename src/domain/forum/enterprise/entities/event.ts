import { AggregateRoot } from "@/core/entities/aggregate-root";
import { Slug } from "./value-objects/slug";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import dayjs from "dayjs";
import { EventCreatedEvent } from "../events/event-created-event";
import { EventAttachmentList } from "./event-attachment-list";

export interface EventProps {
  authorId: UniqueEntityID;
  title: string;
  slug: Slug;
  content: string;
  price: number;
  statusPayment: boolean;
  eventDate: string;
  eventTime: string;
  attachments: EventAttachmentList
  createdAt: Date;
  updatedAt?: Date;
}

export class Event extends AggregateRoot<EventProps> {
  get authorId() {
    return this.props.authorId;
  }

  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);

    this.touch();
  }

  get slug() {
    return this.props.slug;
  }

  get content() {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  get price() {
    return this.props.price;
  }

  set price(price: number) {
    this.props.price = price;
    this.touch();
  }

  get statusPayment() {
    return this.props.statusPayment;
  }

  set statusPayment(statusPayment: boolean) {
    this.props.statusPayment = statusPayment;
    this.touch();
  }

  get eventDate() {
    return this.props.eventDate;
  }

  set eventDate(eventDate: string) {
    this.props.eventDate = eventDate;
    this.touch();
  }

  get eventTime() {
    return this.props.eventTime;
  }

  set eventTime(eventTime: string) {
    this.props.eventTime = eventTime;
    this.touch();
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: EventAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat("...");
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<EventProps, "createdAt" | "slug" | "attachments" >,
    id?: UniqueEntityID
  ) {
    const event = new Event(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new EventAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    const isNewEvent = !id

    if (isNewEvent) {
      event.addDomainEvent(new EventCreatedEvent(event))
    }

    return event;
  }
}
